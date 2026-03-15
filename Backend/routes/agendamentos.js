const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  
  // Rota que você já tinha: Criar Agendamento
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

  // --- NOVA ROTA ADICIONADA AQUI ---
  // BUSCAR AGENDAMENTOS DE UM USUÁRIO ESPECÍFICO
  router.get('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const [linhas] = await pool.query(`
        SELECT 
          a.id, a.data_reserva, a.horario, a.status,
          b.nome as barbeiro_nome, b.icone as barbeiro_icone,
          s.nome as servico_nome
        FROM agendamentos a
        JOIN barbeiros b ON a.barbeiro_id = b.id
        JOIN servicos s ON a.servico_id = s.id
        WHERE a.usuario_id = ?
        ORDER BY a.data_reserva DESC, a.horario DESC
      `, [id]);

      res.json(linhas);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao buscar históricos' });
    }
  });
  // --------------------------------

  return router;
};