import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/tmdb', // Endereço do seu backend
});

export default boot(({ app }) => {
  // Fornecendo o TMDb globalmente
  app.provide('$tmdb', {
    fetch: (endpoint, params = {}) =>
      api.get(`/${endpoint}`, { params })
        .then(res => res.data)
        .catch(err => {
          console.error(`Erro ao buscar ${endpoint}:`, err);
          return null;
        }),
  });
});
