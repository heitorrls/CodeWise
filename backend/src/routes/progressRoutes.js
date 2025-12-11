const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Registra/Acumula estatísticas da sessão
router.post('/progress', progressController.addProgress);

// Resumo por usuário
router.get('/progress/summary/:userId', progressController.getSummary);

module.exports = router;
