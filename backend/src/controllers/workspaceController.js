const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Project = require('../models/Project');
const Invitation = require('../models/Invitation');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    const workspace = await Workspace.create({
      name: name.trim(),
      description: description || '',
      owner: req.user._id,
      members: [req.user._id],
    });

    const populated = await Workspace.findById(workspace._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    try {
      await Activity.create({
        userId: req.user._id,
        action: 'created',
        entityType: 'Workspace',
        entityId: workspace._id,
        description: `${req.user.name} created Workspace "${workspace.name}"`,
      });
    } catch (e) {}

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create workspace', error: error.message });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email role')
      .populate('members', 'name email role')
      .sort({ updatedAt: -1 });

    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workspaces', error: error.message });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const isMember = workspace.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    ) || workspace.owner._id.toString() === req.user._id.toString();

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this workspace' });
    }

    const projects = await Project.find({
      $or: [
        { workspaceId: workspace._id },
        { workspaceName: workspace.name },
      ],
    })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(200).json({ workspace, projects });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workspace details', error: error.message });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the workspace owner can perform updates' });
    }

    const { name, description } = req.body;
    if (name !== undefined) workspace.name = name.trim();
    if (description !== undefined) workspace.description = description;

    await workspace.save();

    const updated = await Workspace.findById(workspace._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update workspace', error: error.message });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the workspace owner can delete this workspace' });
    }

    await workspace.deleteOne();
    res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete workspace', error: error.message });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const isAuthorized = workspace.owner.toString() === req.user._id.toString() ||
      workspace.members.some((m) => m.toString() === req.user._id.toString());
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to send invites for this workspace' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const targetUser = await User.findOne({ email: normalizedEmail });
    if (!targetUser) {
      return res.status(404).json({ message: `No registered user found with email "${email}"` });
    }

    const isAlreadyMember = workspace.members.some(
      (m) => m.toString() === targetUser._id.toString()
    );
    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this workspace' });
    }

    // Add member to workspace directly and log invitation
    workspace.members.push(targetUser._id);
    await workspace.save();

    const existingInvite = await Invitation.findOne({
      workspaceId: workspace._id,
      inviteeEmail: normalizedEmail,
      status: 'Pending',
    });

    if (!existingInvite) {
      await Invitation.create({
        workspaceId: workspace._id,
        inviter: req.user._id,
        inviteeEmail: normalizedEmail,
        status: 'Accepted',
      });
    }

    try {
      await Notification.create({
        userId: targetUser._id,
        title: 'Workspace Invitation',
        message: `${req.user.name} added you to workspace "${workspace.name}"`,
        type: 'Workspace Invitation',
      });
    } catch (e) {}

    const updatedWorkspace = await Workspace.findById(workspace._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    res.status(200).json({
      message: `User ${targetUser.name} successfully added to workspace`,
      workspace: updatedWorkspace,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to invite member', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the workspace owner can remove members' });
    }

    if (workspace.owner.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove workspace owner' });
    }

    workspace.members = workspace.members.filter(
      (m) => m.toString() !== userId
    );

    await workspace.save();

    const updated = await Workspace.findById(workspace._id)
      .populate('owner', 'name email role')
      .populate('members', 'name email role');

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove member', error: error.message });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  removeMember,
};
