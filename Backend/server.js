const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'barbearia',
});

// --- IMPORTANDO AS ROTAS ---
const authRoutes = require('./routes/auth');
const barbeariaRoutes = require('./routes/barbearia');
const agendamentoRoutes = require('./routes/agendamentos');
const adminRoutes = require('./routes/admin');

// --- APLICANDO AS ROTAS ---
app.use('/api/auth', authRoutes(pool));
app.use('/api/barbearia', barbeariaRoutes(pool));
app.use('/api/agendamentos', agendamentoRoutes(pool));
app.use('/api/admin', adminRoutes(pool));

app.listen(3000, () => {
  console.log(`🚀 Servidor organizado e rodando na porta 3000`);
});