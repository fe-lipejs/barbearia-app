const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuração de onde salvar as fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

module.exports = (pool) => {

    // CADASTRAR BARBEIRO COM FOTO
    router.post('/barbeiros', upload.single('foto'), async (req, res) => {
        const { nome } = req.body;
        const fotoPath = req.file ? req.file.filename : null;
        try {
            await pool.query('INSERT INTO barbeiros (nome, foto) VALUES (?, ?)', [nome, fotoPath]);
            res.json({ success: true });
        } catch (err) { res.status(500).send(err); }
    });

    // CADASTRAR SERVIÇO COM FOTO
    router.post('/servicos', upload.single('foto'), async (req, res) => {
        const { nome, preco } = req.body;
        const fotoPath = req.file ? req.file.filename : null;
        try {
            await pool.query('INSERT INTO servicos (nome, preco, foto) VALUES (?, ?, ?)', [nome, preco, fotoPath]);
            res.json({ success: true });
        } catch (err) { res.status(500).send(err); }
    });

    // ALTERAR TEMA (Ajustado)
    router.post('/config/tema', async (req, res) => {
        const { valor } = req.body;
        await pool.query('UPDATE configuracoes SET valor = ? WHERE chave = "tema"', [valor]);
        res.json({ success: true });
    });


    // Definir/Atualizar Horário de Trabalho Semanal
    router.post('/horarios-trabalho', async (req, res) => {
        const { barbeiro_id, grade } = req.body;
        // 'grade' seria um array: [{dia: 1, inicio: '08:00', fim: '18:00', ...}]
        try {
            // Limpa a grade antiga para inserir a nova
            await pool.query('DELETE FROM horarios_trabalho WHERE barbeiro_id = ?', [barbeiro_id]);

            for (let dia of grade) {
                await pool.query(
                    'INSERT INTO horarios_trabalho (barbeiro_id, dia_semana, hora_inicio, hora_fim, almoco_inicio, almoco_fim) VALUES (?, ?, ?, ?, ?, ?)',
                    [barbeiro_id, dia.dia, dia.inicio, dia.fim, dia.almoco_inicio, dia.almoco_fim]
                );
            }
            res.json({ success: true });
        } catch (err) { res.status(500).json(err); }
    });

    // Bloquear um Horário ou Dia Específico
    router.post('/bloqueios', async (req, res) => {
        const { barbeiro_id, data, hora_inicio, hora_fim, motivo } = req.body;
        try {
            await pool.query(
                'INSERT INTO bloqueios (barbeiro_id, data_bloqueio, hora_inicio, hora_fim, motivo) VALUES (?, ?, ?, ?, ?)',
                [barbeiro_id, data, hora_inicio, hora_fim, motivo]
            );
            res.json({ success: true });
        } catch (err) { res.status(500).json(err); }
    });

    return router;
};