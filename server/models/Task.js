const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed', 'Submitted', 'Approved', 'Rejected'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dueDate: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Middleware to cascade delete submissions related to the task to prevent orphaned records (Issue #5)
taskSchema.pre('findOneAndDelete', async function (next) {
  const taskId = this.getQuery()['_id'];
  if (taskId) {
    const Submission = mongoose.model('Submission');
    await Submission.deleteMany({ taskId: taskId });
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
