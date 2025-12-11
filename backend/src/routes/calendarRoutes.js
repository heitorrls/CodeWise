const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/:userId', calendarController.getLoginDates);

module.exports = router;