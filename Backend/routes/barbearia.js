const express = require('express');
const router = express.Router();

module.exports = (pool) => {

  // 1. ROTA DOS BARBEIROS
  router.get('/barbeiros', async (req, res) => {
    try {
      const [linhas] = await pool.query('SELECT * FROM barbeiros');
      res.json(linhas);
    } catch (erro) {
      res.status(500).json({ error: 'Erro ao buscar barbeiros' });
    }
  });

  // 2. ROTA DOS SERVIÇOS
  router.get('/servicos', async (req, res) => {
    try {
      const [linhas] = await pool.query('SELECT * FROM servicos');
      res.json(linhas);
    } catch (erro) {
      res.status(500).json({ error: 'Erro ao buscar servicos' });
    }
  });

  // 3. ROTA DO TEMA
  router.get('/config/tema', async (req, res) => {
    try {
      const [linhas] = await pool.query('SELECT valor FROM configuracoes WHERE chave = "tema"');
      if (linhas.length > 0) {
        res.json(linhas[0]); 
      } else {
        res.json({ valor: 'classic' });
      }
    } catch (erro) {
      res.status(500).json({ error: 'Erro ao buscar tema' });
    }
  });

  // 4. NOVA ROTA: CALCULADORA DE DISPONIBILIDADE
  router.get('/disponibilidade', async (req, res) => {
    const { barbeiro_id, data } = req.query; 
    const dataObjeto = new Date(data);
    const diaSemana = dataObjeto.getDay(); // 0 (Dom) a 6 (Sáb)

    try {
      // Busca a grade de trabalho do barbeiro
      const [grade] = await pool.query(
        'SELECT * FROM horarios_trabalho WHERE barbeiro_id = ? AND dia_semana = ? AND ativo = 1',
        [barbeiro_id, diaSemana]
      );

      if (grade.length === 0) return res.json([]); // Não trabalha no dia

      const { hora_inicio, hora_fim, almoco_inicio, almoco_fim } = grade[0];

      // Busca agendamentos e bloqueios
      const [ocupados] = await pool.query(
        'SELECT horario FROM agendamentos WHERE barbeiro_id = ? AND data_reserva = ? AND status != "cancelado"',
        [barbeiro_id, data]
      );
      
      const [bloqueios] = await pool.query(
        'SELECT hora_inicio, hora_fim FROM bloqueios WHERE barbeiro_id = ? AND data_bloqueio = ?',
        [barbeiro_id, data]
      );

      let slots = [];
      let atual = hora_inicio;

      // Gera slots de 30 em 30 minutos
      while (atual < hora_fim) {
        const estaNoAlmoco = (almoco_inicio && atual >= almoco_inicio && atual < almoco_fim);
        const estaOcupado = ocupados.some(o => o.horario === atual);
        const estaBloqueado = bloqueios.some(b => {
          if (!b.hora_inicio) return true; // Bloqueio do dia todo
          return (atual >= b.hora_inicio && atual < b.hora_fim);
        });

        if (!estaNoAlmoco && !estaOcupado && !estaBloqueado) {
          slots.push(atual.substring(0, 5));
        }

        // Lógica para adicionar 30 min
        let [h, m] = atual.split(':').map(Number);
        m += 30;
        if (m >= 60) { h++; m = 0; }
        atual = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
      }

      res.json(slots);
    } catch (err) {
      res.status(500).json({ error: "Erro ao calcular disponibilidade" });
    }
  });

  return router;
};