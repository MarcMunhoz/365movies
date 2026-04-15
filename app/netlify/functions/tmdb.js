const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const TMDB_BASE_URL = (process.env.TMDB_BASE_URL || process.env.TMDB_API_URL || '').replace(/\/+$/, '');

const proxyTmdb = async (req, res, tmdbPath) => {
  if (!TMDB_BASE_URL || !TMDB_BEARER_TOKEN) {
    return res.status(500).json({
      error: 'TMDB server configuration is missing.',
      hasBaseUrl: Boolean(TMDB_BASE_URL),
      hasBearerToken: Boolean(TMDB_BEARER_TOKEN),
    });
  }

  let cleanPath = '';

  try {
    cleanPath = String(tmdbPath || '')
      .replace(/^\/+/, '')
      .replace(/^\.netlify\/functions\/tmdb\/?/, '')
      .replace(/^api\/tmdb\/?/, '')
      .replace(/^\/+/, '');

    if (!cleanPath) {
      return res.status(400).json({
        error: 'Invalid TMDB endpoint path.',
        path: tmdbPath,
      });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/${cleanPath}`, {
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
      params: req.query,
    });

    res.json(response.data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const details = error?.response?.data || error?.message || 'Unknown error';
    console.error('Erro ao buscar dados do TMDb:', {
      path: tmdbPath,
      status,
      details,
    });
    res.status(status).json({
      error: 'Erro ao buscar dados do TMDb',
      path: tmdbPath,
      normalizedPath: cleanPath,
      details,
    });
  }
};

app.get('/api/tmdb/*', async (req, res) => {
  return proxyTmdb(req, res, req.params[0]);
});

app.get('/*', async (req, res) => {
  return proxyTmdb(req, res, req.params[0]);
});

module.exports.handler = serverless(app);
