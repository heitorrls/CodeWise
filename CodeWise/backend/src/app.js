const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Servindo arquivos estáticos (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, '../../frontend/public')));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 2. Servindo a página de login na rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/apresentacao.html'));
});

module.exports = app;