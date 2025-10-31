const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Servindo arquivos estáticos (CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// --- Rotas ---
// Importa as rotas de autenticação (APENAS UMA VEZ)
const authRoutes = require('./routes/authRoutes'); 

// Importa as rotas de usuário (edição de conta)
const userRoutes = require('./routes/userRoutes');

// Registra as rotas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// -------------

// 2. Servindo a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/apresentacao.html'));
});

module.exports = app;