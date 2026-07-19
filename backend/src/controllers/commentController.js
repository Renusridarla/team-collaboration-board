const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const Task = require('../models/Task');

const getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ taskId }).populate('userId', 'name email').sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const { taskId, comment } = req.body;
    if (!taskId || !comment || !comment.trim()) return res.status(400).json({ message: 'taskId and comment are required' });

    const created = await Comment.create({ taskId, userId: req.user._id, comment: comment.trim() });
    const populated = await Comment.findById(created._id).populate('userId', 'name email');

    // Activity log
    try {
      await Activity.create({
        userId: req.user._id,
        action: 'created',
        entityType: 'Comment',
        entityId: created._id,
        description: `${req.user.name} commented on task`,
      });
    } catch (e) {}

    // Notify assigned user of the task (if commenter is not the assignee)
    try {
      const task = await Task.findById(taskId);
      if (task && task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
        await Notification.create({
          userId: task.assignedTo,
          title: 'Comment',
          message: `${req.user.name} commented on task "${task.title || ''}"`,
          type: 'Comment',
        });
      }
    } catch (e) {}

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    const { comment: text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text is required' });

    comment.comment = text.trim();
    await comment.save();
    const populated = await Comment.findById(comment._id).populate('userId', 'name email');

    try {
      await Activity.create({
        userId: req.user._id,
        action: 'updated',
        entityType: 'Comment',
        entityId: comment._id,
        description: `${req.user.name} updated a comment`,
      });
    } catch (e) {}

    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update comment', error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await comment.deleteOne();

    try {
      await Activity.create({
        userId: req.user._id,
        action: 'deleted',
        entityType: 'Comment',
        entityId: comment._id,
        description: `${req.user.name} deleted a comment`,
      });
    } catch (e) {}

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment', error: error.message });
  }
};

module.exports = { getCommentsByTask, createComment, updateComment, deleteComment };
