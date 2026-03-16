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

    // 4. NOVA ROTA: CALCULADORA DE DISPONIBILIDADE AVANÇADA

    router.get('/disponibilidade', async (req, res) => {
        const { barbeiro_id, data, servico_duracao } = req.query;
        const duracaoServico = parseInt(servico_duracao) || 30;

        // BLINDAGEM DE DATA: Corta qualquer fuso horário que venha do frontend
        const dataLimpa = data.split('T')[0];
        const [ano, mes, dia] = dataLimpa.split('-');
        const dataObjeto = new Date(ano, mes - 1, dia);
        const diaSemana = dataObjeto.getDay();

        try {
            // 1. CHECAGEM DE BLOQUEIO GERAL (A Loja está fechada hoje?)
            const [lojaFechada] = await pool.query(
                'SELECT id FROM estabelecimento_bloqueios WHERE data_bloqueio = ?',
                [data]
            );

            if (lojaFechada.length > 0) {
                return res.json([]); // Se a loja tá fechada, retorna lista vazia (ninguém agenda nada)
            }

            // 2. BUSCA A GRADE DE TRABALHO DO BARBEIRO
            const [grade] = await pool.query(
                'SELECT * FROM horarios_trabalho WHERE barbeiro_id = ? AND dia_semana = ? AND ativo = 1',
                [barbeiro_id, diaSemana]
            );

            if (grade.length === 0) return res.json([]); // Se ele não trabalha nesse dia, retorna vazio

            const { hora_inicio, hora_fim, almoco_inicio, almoco_fim } = grade[0];

            // 3. BUSCA OCUPAÇÕES E BLOQUEIOS INDIVIDUAIS DELE
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

            // 4. GERA OS SLOTS CONSIDERANDO O TEMPO DO SERVIÇO ESCOLHIDO
            while (atual < hora_fim) {

                // Calcula a hora exata que o serviço terminaria
                let [hAtual, mAtual] = atual.split(':').map(Number);
                let mFimServico = mAtual + duracaoServico;
                let hFimServico = hAtual + Math.floor(mFimServico / 60);
                mFimServico = mFimServico % 60;

                let fimDoServico = `${hFimServico.toString().padStart(2, '0')}:${mFimServico.toString().padStart(2, '0')}:00`;

                // REGRA A: O serviço invade o horário de almoço do barbeiro?
                const invadeAlmoco = almoco_inicio && (
                    (atual >= almoco_inicio && atual < almoco_fim) || // O serviço começa durante o almoço
                    (fimDoServico > almoco_inicio && atual < almoco_inicio) // O serviço começa antes, mas termina dentro do almoço
                );

                // REGRA B: O serviço vai passar da hora do barbeiro ir embora?
                const passaDaHora = fimDoServico > hora_fim;

                // REGRA C: Já tem um cliente agendado nesse horário ou o barbeiro bloqueou?
                const estaOcupado = ocupados.some(o => o.horario === atual);
                const estaBloqueado = bloqueios.some(b => {
                    if (!b.hora_inicio) return true; // Bloqueio de dia inteiro
                    return (atual >= b.hora_inicio && atual < b.hora_fim);
                });

                // Se passou em todos os testes, o horário está LIVRE para esse serviço!
                if (!invadeAlmoco && !passaDaHora && !estaOcupado && !estaBloqueado) {
                    slots.push(atual.substring(0, 5));
                }

                // Pula de 30 em 30 minutos para testar o próximo buraco na agenda
                mAtual += 30;
                if (mAtual >= 60) { hAtual++; mAtual = 0; }
                atual = `${hAtual.toString().padStart(2, '0')}:${mAtual.toString().padStart(2, '0')}:00`;
            }

            res.json(slots);
        } catch (err) {
            console.error("Erro na rota de disponibilidade:", err);
            res.status(500).json({ error: "Erro ao calcular disponibilidade" });
        }
    });

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


    return router;
};