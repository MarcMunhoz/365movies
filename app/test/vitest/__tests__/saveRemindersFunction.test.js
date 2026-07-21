import { beforeEach, describe, expect, it, vi } from 'vitest';

const store = {
  delete: vi.fn(),
  set: vi.fn(),
};

vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn(() => store),
}));

describe('save-reminders function', () => {
  beforeEach(() => {
    store.delete.mockReset();
    store.set.mockReset();
  });

  it('stores valid reminder snapshots through the modern Netlify function signature', async () => {
    const { default: handler } = await import('../../../netlify/functions/save-reminders.mjs');
    const response = await handler(
      new Request('https://365movies.example.test/.netlify/functions/save-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          installationId: 'install-1',
          email: 'viewer@example.test',
          preference: 'email',
          movies: [],
        }),
      })
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      installationId: 'install-1',
      movieCount: 0,
    });
    expect(response.status).toBe(200);
    expect(store.set).toHaveBeenCalledWith(
      'install-1.json',
      expect.stringContaining('"email":"viewer@example.test"')
    );
  });

  it('deletes reminder snapshots through the modern Netlify function signature', async () => {
    const { default: handler } = await import('../../../netlify/functions/save-reminders.mjs');
    const response = await handler(
      new Request('https://365movies.example.test/.netlify/functions/save-reminders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installationId: 'install-1' }),
      })
    );

    await expect(response.json()).resolves.toEqual({ ok: true, disabled: true });
    expect(response.status).toBe(200);
    expect(store.delete).toHaveBeenCalledWith('install-1.json');
  });
});
