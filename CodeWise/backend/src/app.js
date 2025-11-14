// ADICIONADO - PASSO 1: Carrega as variáveis de ambiente (como a GEMINI_API_KEY)
require('dotenv').config();

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

// ADICIONADO - PASSO 2: Importa as novas rotas do chat
const chatRoutes = require('./routes/codeBuddyRoutes');
// Rotas de nivelamento
const levelingRoutes = require('./routes/levelingRoutes');

// Registra as rotas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// ADICIONADO - PASSO 3: Registra a nova rota do chat
app.use('/api/chat', chatRoutes);
// Registra rota de nivelamento
app.use('/api/leveling', levelingRoutes);
// -------------\

// 2. Servindo a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/apresentacao.html'));
});

module.exports = app;