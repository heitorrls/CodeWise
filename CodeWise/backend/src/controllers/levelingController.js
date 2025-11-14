const User = require('../models/User');

// Marca o nivelamento como concluído para um usuário
exports.completeLeveling = (req, res) => {
  const { userId, level } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId é obrigatório.' });

  User.markLevelingById(userId, level, (err, affectedRows) => {
    if (err) {
      console.error('Erro ao marcar nivelamento:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }
    if (affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });

    res.status(200).json({ message: 'Nivelamento marcado como concluído.' });
  });
};
