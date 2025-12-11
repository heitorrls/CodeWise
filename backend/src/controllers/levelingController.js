const User = require('../models/User');
const Leveling = require('../models/Leveling'); // <--- IMPORTANTE: Importando o novo arquivo

// Busca as perguntas para o teste
exports.getQuestions = (req, res) => {
  Leveling.getQuestions((err, questions) => {
    if (err) {
      console.error('Erro ao buscar perguntas:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }
    res.status(200).json(questions);
  });
};

// Marca o nivelamento como concluído (Atualiza o User e define o nível)
exports.completeLeveling = (req, res) => {
  const { userId, level } = req.body;
  
  if (!userId) return res.status(400).json({ message: 'userId é obrigatório.' });

  // Aqui você poderia salvar as respostas detalhadas se o frontend as enviasse
  // Mas por enquanto, vamos apenas atualizar o nível do usuário
  User.markLevelingById(userId, level, (err, affectedRows) => {
    if (err) {
      console.error('Erro ao marcar nivelamento:', err);
      return res.status(500).json({ message: 'Erro no servidor.' });
    }
    if (affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });

    res.status(200).json({ message: 'Nivelamento marcado como concluído.' });
  });
};