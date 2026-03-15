const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const [linhas] = await pool.query(
        'SELECT id, nome, email, tipo FROM usuarios WHERE email = ? AND senha = ?',
        [email, password]
      );
      if (linhas.length > 0) {
        res.json({ success: true, user: linhas[0] });
      } else {
        res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
      }
    } catch (erro) {
      res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
  });
  return router;
};