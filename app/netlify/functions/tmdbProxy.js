const normalizeTmdbPath = (tmdbPath) =>
  String(tmdbPath || '')
    .replace(/^\/+/, '')
    .replace(/^\.netlify\/functions\/tmdb\/?/, '')
    .replace(/^api\/tmdb\/?/, '')
    .replace(/^\/+/, '');

const buildMissingTmdbConfigResponse = (baseUrl, bearerToken) => ({
  error: 'TMDB server configuration is missing.',
  hasBaseUrl: Boolean(baseUrl),
  hasBearerToken: Boolean(bearerToken),
});

module.exports = {
  buildMissingTmdbConfigResponse,
  normalizeTmdbPath,
};
