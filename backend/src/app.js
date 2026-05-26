// ADICIONADO - PASSO 1: Carrega as variáveis de ambiente (como a GEMINI_API_KEY)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Servindo arquivos estáticos (CSS, JS, Imagens)
// Ajuste o caminho conforme a estrutura das suas pastas, se necessário
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// --- Rotas ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/codeBuddyRoutes');
const levelingRoutes = require('./routes/levelingRoutes');
const calendarRoutes = require('./routes/calendarRoutes'); 
const progressRoutes = require('./routes/progressRoutes'); 
const profileRoutes = require('./routes/profileRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Registra as rotas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/leveling', levelingRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api', progressRoutes);
app.use('/api', profileRoutes);
app.use('/api/payment', paymentRoutes);

// 2. Servindo a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/homepage.html'));
});

app.get('/monetizacao', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/monetizacao.html'));
});

module.exports = app;
