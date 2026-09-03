const express = require('express');
const { getUserInvitations, respondToInvitation } = require('../controllers/invitationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getUserInvitations);
router.post('/:id/respond', respondToInvitation);

module.exports = router;
