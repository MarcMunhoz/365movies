const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || process.env.TMDB_API_URL;

const proxyTmdb = async (req, res, tmdbPath) => {
  if (!TMDB_BASE_URL || !TMDB_BEARER_TOKEN) {
    return res.status(500).json({ error: 'TMDB server configuration is missing.' });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/${tmdbPath}`, {
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
      params: req.query,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados do TMDb:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do TMDb' });
  }
};

app.get('/api/tmdb/*', async (req, res) => {
  return proxyTmdb(req, res, req.params[0]);
});

app.get('/*', async (req, res) => {
  return proxyTmdb(req, res, req.params[0]);
});

module.exports.handler = serverless(app);
