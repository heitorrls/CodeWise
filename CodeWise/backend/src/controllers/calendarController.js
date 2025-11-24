const LoginHistory = require("../models/LoginHistory");

exports.getLoginDates = (req, res) => {
  const userId = req.params.userId;

  LoginHistory.getUserHistory(userId, (err, dates) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar calendário." });
    }
    
    // Cálculo simples de ofensiva (streak)
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    // Verifica se logou hoje ou ontem para manter a ofensiva ativa
    if (dates.includes(today) || dates.includes(yesterday)) {
        let checkDate = new Date();
        // Se não logou hoje ainda, começa a checar de ontem
        if (!dates.includes(today)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (dates.includes(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1); // Volta um dia
            } else {
                break;
            }
        }
    }

    res.json({ dates, streak });
  });
};