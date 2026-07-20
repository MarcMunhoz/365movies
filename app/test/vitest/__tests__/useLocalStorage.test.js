import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getLocalStorage,
  getSessionStorage,
  removeSessionStorage,
  setLocalStorage,
  setSessionStorage,
} from '../../../src/composables/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('reads and writes JSON values in localStorage', () => {
    const movies = [{ id: 1, title: 'Heat' }];

    setLocalStorage('watchMovies', movies);

    expect(getLocalStorage('watchMovies')).toEqual(movies);
  });

  it('returns the provided default when localStorage key is missing', () => {
    expect(getLocalStorage('watchMovies', ['fallback'])).toEqual(['fallback']);
  });

  it('returns the provided default when localStorage JSON is malformed', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('watchMovies', '{broken');

    expect(getLocalStorage('watchMovies', [])).toEqual([]);
    expect(errorSpy).toHaveBeenCalledOnce();
  });

  it('reads, writes, and removes JSON values in sessionStorage', () => {
    const filters = { region: 'BR', year: 2026 };

    setSessionStorage('filters', filters);
    expect(getSessionStorage('filters')).toEqual(filters);

    removeSessionStorage('filters');
    expect(getSessionStorage('filters', null)).toBeNull();
  });
});
