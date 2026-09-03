const Task = require('../models/Task');

const getCalendar = async (req, res) => {
  try {
    const tasks = await Task.find({ deadline: { $ne: null } })
      .populate('projectId', 'projectName')
      .populate('assignedTo', 'name email')
      .select('title projectId deadline status assignedTo');

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch calendar', error: error.message });
  }
};

module.exports = { getCalendar };
