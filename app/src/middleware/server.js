require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000

app.use(cors());
app.use(express.json());

const TMDB_API_URL = process.env.TMDB_API_URL;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;

// 🔥 Rota dinâmica para qualquer endpoint do TMDb
app.use('/api/tmdb/*', async (req, res) => {
    try {
        const tmdbPath = req.params[0]; // Captura a URL após /api/tmdb/
        const queryParams = req.query; // Captura parâmetros de busca

        const response = await axios.get(`${TMDB_API_URL}/${tmdbPath}`, {
            params: queryParams,
            headers: { Authorization: `Bearer ${TMDB_BEARER_TOKEN}` },
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados do TMDb', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
