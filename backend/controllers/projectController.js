const Project = require("../models/Project");

// Create Project
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    project.title = req.body.title || project.title;
    project.description =
      req.body.description || project.description;

    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    await project.deleteOne();

    res.json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject
};