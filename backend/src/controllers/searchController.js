const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');

const searchAll = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(200).json({ projects: [], tasks: [], comments: [] });

    const regex = new RegExp(q, 'i');

    const projects = await Project.find({
      $or: [
        { projectName: regex },
        { workspaceName: regex },
      ],
    }).limit(20);

    const tasks = await Task.find({
      $or: [
        { title: regex },
        { description: regex },
      ],
    })
      .limit(50)
      .populate('projectId', 'projectName')
      .populate('assignedTo', 'name');

    const comments = await Comment.find({ comment: regex }).limit(50).populate('userId', 'name');

    res.status(200).json({ projects, tasks, comments });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

module.exports = { searchAll };
