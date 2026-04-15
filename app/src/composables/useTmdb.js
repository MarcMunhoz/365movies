export function useTmdb() {
  const apiUrl = process.env.VITE_API_URL;

  return {
    fetch: async (endpoint, params = {}) => {
      const url = `${apiUrl}/${endpoint}?${new URLSearchParams(params)}`;
      const response = await fetch(url);
      return response.json();
    },
  };
}
