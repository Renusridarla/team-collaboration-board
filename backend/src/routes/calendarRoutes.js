const express = require('express');
const { getCalendar } = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getCalendar);

module.exports = router;
