import { describe, expect, it } from 'vitest';
import {
  buildMissingTmdbConfigResponse,
  normalizeTmdbPath,
} from '../../../netlify/functions/tmdbProxy';

describe('tmdbProxy', () => {
  it('normalizes supported TMDB proxy path prefixes', () => {
    expect(normalizeTmdbPath('/api/tmdb/movie/550')).toBe('movie/550');
    expect(normalizeTmdbPath('/.netlify/functions/tmdb/search/movie')).toBe('search/movie');
    expect(normalizeTmdbPath('trending/movie/day')).toBe('trending/movie/day');
  });

  it('returns an empty path for invalid proxy paths', () => {
    expect(normalizeTmdbPath('')).toBe('');
    expect(normalizeTmdbPath(null)).toBe('');
  });

  it('shapes missing TMDB configuration errors without exposing secrets', () => {
    expect(buildMissingTmdbConfigResponse('', 'token')).toEqual({
      error: 'TMDB server configuration is missing.',
      hasBaseUrl: false,
      hasBearerToken: true,
    });
  });
});
