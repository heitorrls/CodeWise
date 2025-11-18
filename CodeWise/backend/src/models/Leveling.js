const db = require("../config/database");

const Leveling = {
  // Busca todas as perguntas e suas alternativas formatadas para o Frontend
  getQuestions: (callback) => {
    const sql = `
      SELECT 
        t.id as question_id, 
        t.enunciado as question_text, 
        a.id as option_id,
        a.texto as option_text, 
        a.correta as is_correct 
      FROM teste_nivelamento t
      JOIN alternativas_nivelamento a ON t.id = a.pergunta_id
      ORDER BY t.id ASC, a.id ASC;
    `;

    db.query(sql, (err, results) => {
      if (err) return callback(err, null);

      const questionsMap = {};
      
      results.forEach(row => {
        if (!questionsMap[row.question_id]) {
          questionsMap[row.question_id] = {
            question: row.question_text,
            options: []
          };
        }

        // Gera a letra (A, B, C, D) dinamicamente baseado na ordem
        const currentOptionsCount = questionsMap[row.question_id].options.length;
        const letters = ['A', 'B', 'C', 'D', 'E'];
        const letter = letters[currentOptionsCount] || '?';

        questionsMap[row.question_id].options.push({
          id: row.option_id,        // ID da alternativa (útil para salvar resposta)
          letter: letter,           // A, B, C...
          text: row.option_text,    // Texto da opção
          correct: row.is_correct === 1 // true/false
        });
      });

      // Transforma o objeto em um array simples para o frontend
      const formattedQuestions = Object.values(questionsMap);
      callback(null, formattedQuestions);
    });
  },

  // Função para salvar a resposta do usuário no histórico (tabela respostas_nivelamento)
  saveAnswer: (userId, questionId, alternativeId, callback) => {
    const sql = "INSERT INTO respostas_nivelamento (user_id, pergunta_id, alternativa_escolhida_id) VALUES (?, ?, ?)";
    db.query(sql, [userId, questionId, alternativeId], (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  }
};

module.exports = Leveling;