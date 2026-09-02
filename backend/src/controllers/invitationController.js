const Invitation = require('../models/Invitation');
const Workspace = require('../models/Workspace');

const getUserInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      inviteeEmail: req.user.email.toLowerCase().trim(),
      status: 'Pending',
    })
      .populate('workspaceId', 'name description owner')
      .populate('inviter', 'name email');

    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invitations', error: error.message });
  }
};

const respondToInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be "accept" or "reject"' });
    }

    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.inviteeEmail.toLowerCase().trim() !== req.user.email.toLowerCase().trim()) {
      return res.status(403).json({ message: 'Not authorized for this invitation' });
    }

    if (action === 'accept') {
      invitation.status = 'Accepted';
      await invitation.save();

      const workspace = await Workspace.findById(invitation.workspaceId);
      if (workspace && !workspace.members.includes(req.user._id)) {
        workspace.members.push(req.user._id);
        await workspace.save();
      }
    } else {
      invitation.status = 'Rejected';
      await invitation.save();
    }

    res.status(200).json({ message: `Invitation ${action}ed successfully`, invitation });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process invitation', error: error.message });
  }
};

module.exports = { getUserInvitations, respondToInvitation };
