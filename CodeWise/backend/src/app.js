const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend/public
app.use(express.static(path.join(__dirname, '../../frontend/public')));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

module.exports = app;