const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['Todo','pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  deadline: {
    type: Date
  },
  createdBy: {
    type: String,
    ref: 'User',
    required: true},
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
