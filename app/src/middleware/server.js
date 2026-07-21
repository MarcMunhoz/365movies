require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const {
  buildMissingTmdbConfigResponse,
  normalizeTmdbPath,
  resolveTmdbBaseUrl,
} = require('../../netlify/functions/tmdbProxy');

const app = express();
const PORT = 3000

app.use(cors());
app.use(express.json());

const TMDB_BASE_URL = resolveTmdbBaseUrl();
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

app.use('/api/tmdb/*', async (req, res) => {
  let cleanPath = '';

  try {
    if (!TMDB_BASE_URL || !TMDB_BEARER_TOKEN) {
      return res.status(500).json(buildMissingTmdbConfigResponse(TMDB_BASE_URL, TMDB_BEARER_TOKEN));
    }

    cleanPath = normalizeTmdbPath(req.params[0]);

    if (!cleanPath) {
      return res.status(400).json({
        error: 'Invalid TMDB endpoint path.',
        path: req.params[0],
      });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/${cleanPath}`, {
      params: req.query,
      headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
    });

    res.json(response.data);
  } catch (error) {
    const status = error?.response?.status || 500;
    res.status(status).json({
      error: 'Erro ao buscar dados do TMDb',
      path: req.params[0],
      normalizedPath: cleanPath,
      details: error?.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serving backend on http://localhost:${PORT}`);
});
