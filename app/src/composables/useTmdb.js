import { inject } from 'vue';

export function useTmdb() {
  const tmdb = inject('$tmdb'); // Acessando o $tmdb fornecido globalmente

  if (!tmdb) {
    throw new Error('O TMDb não foi injetado corretamente. Verifique se o boot file foi carregado.');
  }

  return {
    fetch: tmdb.fetch,
  };
}
