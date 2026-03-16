const express = require('express');
const router = express.Router();

module.exports = (pool) => {

  // ==========================================
  // 1. GESTÃO DE SERVIÇOS
  // ==========================================
  router.post('/servicos', async (req, res) => {
    const { nome, preco, duracao, icone } = req.body;
    try {
      await pool.query(
        'INSERT INTO servicos (nome, preco, duracao, icone) VALUES (?, ?, ?, ?)', 
        [nome, preco, duracao, icone]
      );
      res.json({ success: true });
    } catch (err) { res.status(500).send(err); }
  });

  // ==========================================
  // 2. GESTÃO DA GRADE DE HORÁRIOS
  // ==========================================
  router.get('/horarios-trabalho/:barbeiro_id', async (req, res) => {
    try {
      const [linhas] = await pool.query(
        'SELECT * FROM horarios_trabalho WHERE barbeiro_id = ?', 
        [req.params.barbeiro_id]
      );
      res.json(linhas);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar horários." });
    }
  });

  // Salva a grade do barbeiro (COM BLINDAGEM DE BOOLEANO)
  router.post('/horarios-trabalho', async (req, res) => {
    const { barbeiro_id, grade } = req.body;
    try {
      await pool.query('DELETE FROM horarios_trabalho WHERE barbeiro_id = ?', [barbeiro_id]);

      const promises = grade.map(d => {
        // A MÁGICA ESTÁ AQUI: Forçamos o 1 ou 0 para o MySQL não se confundir
        const isAtivo = d.ativo ? 1 : 0; 

        return pool.query(
          `INSERT INTO horarios_trabalho 
          (barbeiro_id, dia_semana, hora_inicio, hora_fim, almoco_inicio, almoco_fim, ativo) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [barbeiro_id, d.dia, d.inicio, d.fim, d.almoco_in || null, d.almoco_out || null, isAtivo]
        );
      });

      await Promise.all(promises);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao salvar horários." });
    }
  });

  // ==========================================
  // 3. GESTÃO DE BLOQUEIOS GERAIS (FERIADOS)
  // ==========================================
  router.post('/bloqueio-geral', async (req, res) => {
    const { data, motivo } = req.body;
    try {
      await pool.query(
        'INSERT INTO estabelecimento_bloqueios (data_bloqueio, motivo) VALUES (?, ?)',
        [data, motivo]
      );
      res.json({ success: true });
    } catch (err) { res.status(500).send(err); }
  });

  router.get('/bloqueios-gerais', async (req, res) => {
    try {
      const [linhas] = await pool.query(
        'SELECT * FROM estabelecimento_bloqueios ORDER BY data_bloqueio ASC'
      );
      res.json(linhas);
    } catch (err) { res.status(500).send(err); }
  });

  router.delete('/bloqueio-geral/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM estabelecimento_bloqueios WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).send(err); }
  });

  return router;
};