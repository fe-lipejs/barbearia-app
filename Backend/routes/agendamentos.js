const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.post('/', async (req, res) => {
    const { usuario_id, barbeiro_id, servico_id, data_reserva, horario } = req.body;
    try {
      const [resul] = await pool.query(
        'INSERT INTO agendamentos (usuario_id, barbeiro_id, servico_id, data_reserva, horario) VALUES (?, ?, ?, ?, ?)',
        [usuario_id, barbeiro_id, servico_id, data_reserva, horario]
      );
      res.json({ success: true, id: resul.insertId });
    } catch (erro) {
      res.status(500).json({ success: false });
    }
  });
  return router;
};