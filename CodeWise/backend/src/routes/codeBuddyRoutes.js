// Em CodeWise/backend/src/routes/chatRoutes.js

const express = require('express');
const router = express.Router();

// 1. IMPORTANTE: Puxe do seu controller existente
const codeBuddyController = require('../controllers/codeBuddyController');

// 2. Aponte a rota para a nova função
router.post('/', codeBuddyController.handleChat);

module.exports = router;