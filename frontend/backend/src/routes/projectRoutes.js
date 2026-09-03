const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { projectValidationMiddleware } = require('../validations/projectValidation');
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');

const router = express.Router();

router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.post('/', protect, projectValidationMiddleware(false), createProject);
router.put('/:id', protect, projectValidationMiddleware(true), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
