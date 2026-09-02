const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    // optional explicit references for quick querying
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    entityType: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Activity', ActivitySchema);
