const Project = require('../models/Project');
const Task = require('../models/Task');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Projects user is part of
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { members: userId }],
    }).select('_id projectName workspaceName status');

    const totalProjects = projects.length;

    // Tasks user created or is assigned to
    const tasks = await Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    }).populate('projectId', 'projectName workspaceName');

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed' || t.status === 'COMPLETED').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress' || t.status === 'IN_PROGRESS').length;
    const pendingTasks = tasks.filter((t) => t.status === 'To Do' || t.status === 'TODO').length;

    const now = new Date();
    const overdueTasks = tasks.filter(
      (t) => t.deadline && new Date(t.deadline) < now && t.status !== 'Completed' && t.status !== 'COMPLETED'
    ).length;

    // Workspaces user is part of
    const workspaces = await Workspace.find({
      $or: [{ owner: userId }, { members: userId }],
    }).populate('members', 'name email');

    // Aggregate unique team members
    const memberSet = new Set();
    workspaces.forEach((w) => {
      w.members.forEach((m) => memberSet.add(m._id.toString()));
    });
    // Add current user if set is empty
    memberSet.add(userId.toString());
    const totalTeamMembers = memberSet.size;

    // Get upcoming deadlines (due within next 7 days)
    const upcomingDeadlines = tasks
      .filter((t) => t.deadline && t.status !== 'Completed' && t.status !== 'COMPLETED')
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5)
      .map((t) => ({
        id: t._id,
        title: t.title,
        project: t.projectId?.projectName || 'Project',
        due: new Date(t.deadline).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

    res.status(200).json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      teamMembers: totalTeamMembers,
      upcomingDeadlines,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
};

module.exports = { getDashboardStats };
