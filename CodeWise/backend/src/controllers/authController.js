const User = require('../models/User');

exports.signup = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Preencha todos os campos.' });

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });
    if (user) return res.status(409).json({ message: 'Email já cadastrado.' });

    User.create(email, password, (err, userId) => {
      if (err) return res.status(500).json({ message: 'Erro ao cadastrar.' });
      res.status(201).json({ message: 'Cadastro realizado com sucesso!', userId });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Preencha todos os campos.' });

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado.' });
    if (user.password !== password) return res.status(401).json({ message: 'Senha incorreta.' });

    res.json({ message: 'Login realizado com sucesso!', user: { id: user.id, email: user.email } });
  });
};