const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

app.get('/api/tmdb/:endpoint', async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/${req.params.endpoint}`, {
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
      params: req.query,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados do TMDb:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do TMDb' });
  }
});

module.exports.handler = serverless(app);
