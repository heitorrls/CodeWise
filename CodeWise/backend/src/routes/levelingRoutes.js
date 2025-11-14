const express = require('express');
const router = express.Router();
const levelingController = require('../controllers/levelingController');

// Marca nivelamento concluído
router.post('/complete', levelingController.completeLeveling);

module.exports = router;
