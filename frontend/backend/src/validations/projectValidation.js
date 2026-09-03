const mongoose = require('mongoose');

const allowedStatuses = ['Active', 'Completed', 'Archived'];

const normalizeMembersInput = (members) => {
  if (typeof members === 'string') {
    return members.split(',').map((item) => item.trim()).filter(Boolean);
  }

  if (Array.isArray(members)) {
    return members
      .flatMap((item) => {
        if (typeof item === 'string') {
          return item.split(',').map((value) => value.trim());
        }
        if (item) {
          return [String(item).trim()];
        }
        return [];
      })
      .filter(Boolean);
  }

  return [];
};

const validateProjectPayload = (payload = {}, { isUpdate = false } = {}) => {
  const errors = [];
  const cleaned = {};
  const { projectName, description, workspaceName, members, status } = payload;

  if (!isUpdate || projectName !== undefined) {
    if (!projectName || !String(projectName).trim()) {
      errors.push('Project name is required');
    } else {
      cleaned.projectName = String(projectName).trim();
    }
  }

  if (description !== undefined) {
    cleaned.description = String(description || '');
  }

  if (workspaceName !== undefined) {
    cleaned.workspaceName = String(workspaceName || 'Default Workspace');
  }

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      errors.push(`Status must be one of: ${allowedStatuses.join(', ')}`);
    } else {
      cleaned.status = status;
    }
  }

  if (members !== undefined) {
    cleaned.members = normalizeMembersInput(members);
  }

  return { errors, cleaned };
};

const projectValidationMiddleware = (isUpdate = false) => (req, res, next) => {
  const { errors, cleaned } = validateProjectPayload(req.body, { isUpdate });
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  req.validatedProject = cleaned;
  next();
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

module.exports = {
  allowedStatuses,
  validateProjectPayload,
  projectValidationMiddleware,
  normalizeMembersInput,
  isValidObjectId,
};
