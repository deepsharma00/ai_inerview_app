import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify a candidate']
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Please specify a role']
  },
  techStacks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechStack'
  }],
  techStack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TechStack'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please specify a scheduled date']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Please specify a scheduled time']
  },
  duration: {
    type: Number,
    required: [true, 'Please specify interview duration in minutes'],
    default: 30
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Interview = mongoose.model('Interview', InterviewSchema);

export default Interview; 