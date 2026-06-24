const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Registra/Acumula estatísticas da sessão
router.post('/progress', progressController.addProgress);

// Resumo por usuário
router.get('/progress/summary/:userId', progressController.getSummary);
router.get(
  '/activity-progress/:userId',
  progressController.getActivityProgress
);
router.get('/activity-answers', progressController.getActivityAnswers);
router.post('/activity-answers', progressController.saveActivityAnswer);
router.delete('/activity-answers', progressController.resetActivityAnswers);

module.exports = router;
