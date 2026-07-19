const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

const getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, projectId, deadlineBefore, deadlineAfter, search } = req.query;

    const baseQuery = { $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] };

    if (status) baseQuery.status = status;
    if (priority) baseQuery.priority = priority;
    if (assignedTo) baseQuery.assignedTo = assignedTo;
    if (projectId) baseQuery.projectId = projectId;
    if (deadlineBefore || deadlineAfter) baseQuery.deadline = {};
    if (deadlineBefore) baseQuery.deadline.$lte = new Date(deadlineBefore);
    if (deadlineAfter) baseQuery.deadline.$gte = new Date(deadlineAfter);
    if (search) {
      const regex = new RegExp(search, 'i');
      baseQuery.$or = [
        { title: regex },
        { description: regex },
        { createdBy: req.user._id },
        { assignedTo: req.user._id },
      ];
    }

    const tasks = await Task.find(baseQuery)
      .populate('projectId', 'projectName workspaceName')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { status, priority, assignedTo, deadlineBefore, deadlineAfter, search } = req.query;

    const q = { projectId };
    if (status) q.status = status;
    if (priority) q.priority = priority;
    if (assignedTo) q.assignedTo = assignedTo;
    if (deadlineBefore || deadlineAfter) q.deadline = {};
    if (deadlineBefore) q.deadline.$lte = new Date(deadlineBefore);
    if (deadlineAfter) q.deadline.$gte = new Date(deadlineAfter);
    if (search) {
      const regex = new RegExp(search, 'i');
      q.$or = [{ title: regex }, { description: regex }];
    }

    const tasks = await Task.find(q)
      .populate('projectId', 'projectName workspaceName')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks for project', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projectId', 'projectName workspaceName')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch task', error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, status, deadline } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'To Do',
      deadline: deadline || null,
    });

    const createdTask = await Task.findById(task._id)
      .populate('projectId', 'projectName workspaceName')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    try {
      await Activity.create({
        userId: req.user._id,
        action: 'created',
        entityType: 'Task',
        entityId: createdTask._id,
        description: `${req.user.name} created Task "${createdTask.title}"`,
      });
    } catch (e) {}

    // Notify assigned user
    try {
      if (createdTask.assignedTo) {
        await Notification.create({
          userId: createdTask.assignedTo,
          title: 'Task Assigned',
          message: `${req.user.name} assigned task "${createdTask.title}" to you`,
          type: 'Task Assigned',
        });
      }
      // Notify about near deadline (within 24h)
      if (createdTask.deadline && createdTask.assignedTo) {
        const deadline = new Date(createdTask.deadline);
        const now = new Date();
        const diff = deadline - now;
        if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
          await Notification.create({
            userId: createdTask.assignedTo,
            title: 'Deadline',
            message: `Task "${createdTask.title}" is due within 24 hours`,
            type: 'Deadline',
          });
        }
      }
    } catch (e) {}

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can update this task' });
    }

    const { title, description, projectId, assignedTo, priority, status, deadline } = req.body;

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (projectId !== undefined) task.projectId = projectId;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = deadline || null;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('projectId', 'projectName workspaceName')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    try {
      await Activity.create({
        userId: req.user._id,
        action: 'updated',
        entityType: 'Task',
        entityId: updatedTask._id,
        description: `${req.user.name} updated Task "${updatedTask.title}"`,
      });
    } catch (e) {}

    try {
      // notify assignee if assignment changed or deadline changed
      if (updatedTask.assignedTo) {
        await Notification.create({
          userId: updatedTask.assignedTo,
          title: 'Project Update',
          message: `${req.user.name} updated task "${updatedTask.title}"`,
          type: 'Project Update',
        });
      }
      if (updatedTask.deadline && updatedTask.assignedTo) {
        const deadline = new Date(updatedTask.deadline);
        const now = new Date();
        const diff = deadline - now;
        if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
          await Notification.create({
            userId: updatedTask.assignedTo,
            title: 'Deadline',
            message: `Task "${updatedTask.title}" is due within 24 hours`,
            type: 'Deadline',
          });
        }
      }
    } catch (e) {}

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can delete this task' });
    }

    const title = task.title;
    await task.deleteOne();
    try {
      await Activity.create({
        userId: req.user._id,
        action: 'deleted',
        entityType: 'Task',
        entityId: task._id,
        description: `${req.user.name} deleted Task "${title}"`,
      });
    } catch (e) {}

    try {
      await Notification.create({
        userId: task.createdBy,
        title: 'Task Deleted',
        message: `${req.user.name} deleted task "${title}"`,
        type: 'Project Update',
      });
    } catch (e) {}

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { status } = req.body;
    if (!['To Do', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid task status' });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('projectId', 'projectName workspaceName')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    try {
      await Activity.create({
        userId: req.user._id,
        action: 'status_changed',
        entityType: 'Task',
        entityId: updatedTask._id,
        description: `${req.user.name} moved "${updatedTask.title}" to ${status}`,
      });
    } catch (e) {}

    try {
      if (status === 'Completed') {
        // notify creator that task completed
        await Notification.create({
          userId: updatedTask.createdBy,
          title: 'Task Completed',
          message: `${req.user.name} marked task "${updatedTask.title}" as completed`,
          type: 'Task Completed',
        });
      }
    } catch (e) {}

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task status', error: error.message });
  }
};

module.exports = { getTasks, getTasksByProject, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus };
