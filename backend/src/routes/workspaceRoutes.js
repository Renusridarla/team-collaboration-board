const express = require('express');
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  removeMember,
} = require('../controllers/workspaceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(createWorkspace).get(getWorkspaces);
router.route('/:id').get(getWorkspaceById).put(updateWorkspace).delete(deleteWorkspace);
router.post('/:id/invite', inviteMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
