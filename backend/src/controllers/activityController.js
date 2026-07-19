const Activity = require('../models/Activity');

const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 0;
    const query = Activity.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    if (limit > 0) query.limit(limit);
    const activities = await query.exec();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
  }
};

module.exports = { getActivities };
