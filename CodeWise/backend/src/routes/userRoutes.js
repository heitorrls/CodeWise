const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Atualiza username e/ou email do usuário
router.put('/user', userController.updateUserProfile);

// Altera a senha do usuário
router.put('/password', userController.changePassword);

// Exclui usuário por ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
