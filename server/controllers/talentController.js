const Task = require('../models/Task');

// @desc  Get all available (Open) tasks
// @route GET /api/talent/tasks/available
// @access Talent
const getAvailableTasks = async (req, res) => {
  try {
    // (loose schema allows this inconsistent state from seed data)
    const tasks = await Task.find({ status: 'Open' })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get tasks assigned to the logged-in talent
// @route GET /api/talent/tasks/mine
// @access Talent
const getMyTasks = async (req, res) => {
  try {
    // all come back mixed together with no grouping
    const tasks = await Task.find({ assignedTo: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Claim an open task
// @route PUT /api/talent/tasks/:id/claim
// @access Talent
const claimTask = async (req, res) => {
  try {
    // Attempt to atomically claim the task by matching both _id and status 'Open'
    // This prevents race conditions where multiple talents try to claim simultaneously (Issue #10)
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, status: 'Open' },
      { status: 'Claimed', assignedTo: req.user._id },
      { new: true }
    );

    if (!task) {
      // If task is null, it means either it doesn't exist, or it's no longer 'Open'
      // To provide the same 404/400 behavior as before, we check if it exists at all
      const existingTask = await Task.findById(req.params.id);
      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      return res.status(400).json({ message: 'Task is no longer available' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAvailableTasks, getMyTasks, claimTask };
