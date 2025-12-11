const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Altera a senha do usuário
router.put('/password', userController.changePassword);

// Atualiza username e/ou email do usuário (corpo ou param)
router.put('/user', userController.updateUserProfile);
router.put('/:id', userController.updateUserProfile);

// Exclui usuário por ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
