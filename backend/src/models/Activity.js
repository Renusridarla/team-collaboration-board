const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String },
  },
  { timestamps: { createdAt: 'createdAt' } }
);

module.exports = mongoose.model('Activity', ActivitySchema);
