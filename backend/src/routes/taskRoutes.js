const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getTasks, getTasksByProject, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController');

const router = express.Router();

router.get('/', protect, getTasks);
router.get('/project/:projectId', protect, getTasksByProject);
router.get('/:id', protect, getTaskById);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;
