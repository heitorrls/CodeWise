const express = require('express');
const router = express.Router();
const levelingController = require('../controllers/levelingController');

// Rota GET para buscar as perguntas
router.get('/questions', levelingController.getQuestions);

// Rota POST para finalizar o teste
router.post('/complete', levelingController.completeLeveling);

module.exports = router;