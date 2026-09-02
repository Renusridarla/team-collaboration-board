const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const { projectValidationMiddleware, normalizeMembersInput } = require('../validations/projectValidation');

const getProjects = async (req, res) => {
  try {
    const { status, workspace, search } = req.query;
    const q = { $or: [{ createdBy: req.user._id }, { members: req.user._id }] };
    if (status) q.status = status;
    if (workspace) q.workspaceName = workspace;
    if (search) {
      const regex = new RegExp(search, 'i');
      q.$or = [{ projectName: regex }, { workspaceName: regex }, { createdBy: req.user._id }, { members: req.user._id }];
    }

    const projects = await Project.find(q)
      .populate('createdBy', 'name email')
      .populate('members', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isVisible = project.createdBy._id.toString() === req.user._id.toString() || project.members.some((member) => member._id.toString() === req.user._id.toString());

    if (!isVisible) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project', error: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { projectName, description, workspaceName, members, status } = req.validatedProject;

    const normalizedMembers = normalizeMembersInput(members);
    const project = await Project.create({
      projectName,
      description,
      workspaceName,
      createdBy: req.user._id,
      members: normalizedMembers,
      status: status || 'Active',
    });

    const createdProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    // create activity log
    try {
      await Activity.create({
        userId: req.user._id,
        action: 'created',
        entityType: 'Project',
        entityId: createdProject._id,
        projectId: createdProject._id,
        description: `${req.user.name} created Project "${createdProject.projectName}"`,
      });
    } catch (e) {}

    // notify members about project creation
    try {
      for (const member of createdProject.members || []) {
        await Notification.create({
          userId: member._id,
          title: 'Project Update',
          message: `${req.user.name} created project "${createdProject.projectName}"`,
          type: 'Project Update',
        });
      }
    } catch (e) {}

    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can update this project' });
    }

    const { projectName, description, workspaceName, members, status } = req.validatedProject;

    if (projectName !== undefined) project.projectName = projectName;
    if (description !== undefined) project.description = description;
    if (workspaceName !== undefined) project.workspaceName = workspaceName;
    if (members !== undefined) project.members = normalizeMembersInput(members);
    if (status !== undefined) project.status = status;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');


    try {
      await Activity.create({
        userId: req.user._id,
        action: 'updated',
        entityType: 'Project',
        entityId: updatedProject._id,
        projectId: updatedProject._id,
        description: `${req.user.name} updated Project "${updatedProject.projectName}"`,
      });
    } catch (e) {}

    // notify members about project update
    try {
      for (const member of updatedProject.members || []) {
        await Notification.create({
          userId: member._id,
          title: 'Project Update',
          message: `${req.user.name} updated project "${updatedProject.projectName}"`,
          type: 'Project Update',
        });
      }
    } catch (e) {}

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the creator can delete this project' });
    }

    const projectName = project.projectName;
    await project.deleteOne();
    try {
      await Activity.create({
        userId: req.user._id,
        action: 'deleted',
        entityType: 'Project',
        entityId: project._id,
        projectId: project._id,
        description: `${req.user.name} deleted Project "${projectName}"`,
      });
    } catch (e) {}

    try {
      for (const member of project.members || []) {
        await Notification.create({
          userId: member,
          title: 'Project Update',
          message: `${req.user.name} deleted project "${projectName}"`,
          type: 'Project Update',
        });
      }
    } catch (e) {}

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
