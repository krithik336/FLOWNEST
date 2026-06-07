const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("projectId", "title");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = req.body.status;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};