const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  router.get('/barbeiros', async (req, res) => {
    const [linhas] = await pool.query('SELECT * FROM barbeiros');
    res.json(linhas);
  });

  router.get('/servicos', async (req, res) => {
    const [linhas] = await pool.query('SELECT * FROM servicos');
    res.json(linhas);
  });

  return router;
};