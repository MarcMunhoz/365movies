import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const snapshotStore = {
  delete: vi.fn(),
  set: vi.fn(),
};
const sentMarkerStore = {
  get: vi.fn(),
  set: vi.fn(),
};

vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn((name) => (name === 'agenda-reminder-snapshots' ? snapshotStore : sentMarkerStore)),
}));

describe('save-reminders function', () => {
  beforeEach(() => {
    snapshotStore.delete.mockReset();
    snapshotStore.set.mockReset();
    sentMarkerStore.get.mockReset();
    sentMarkerStore.set.mockReset();
    sentMarkerStore.get.mockResolvedValue(null);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(''),
    });
    vi.stubEnv('BREVO_API_KEY', 'secret');
    vi.stubEnv('BREVO_SENDER_EMAIL', 'sender@example.test');
    vi.stubEnv('BREVO_SENDER_NAME', '365movies');
    vi.stubEnv('BREVO_APP_URL', 'https://365movies.example.test');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
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

    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      installationId: 'install-1',
      movieCount: 0,
      catchUp: { ok: true, sent: 0, skippedDuplicates: 0 },
    });
    expect(response.status).toBe(200);
    expect(snapshotStore.set).toHaveBeenCalledWith(
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
    expect(snapshotStore.delete).toHaveBeenCalledWith('install-1.json');
  });

  it('attempts catch-up delivery after storing due reminder snapshots', async () => {
    const { default: handler } = await import('../../../netlify/functions/save-reminders.mjs');
    const response = await handler(
      new Request('https://365movies.example.test/.netlify/functions/save-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          installationId: 'install-1',
          email: 'viewer@example.test',
          preference: 'email',
          movies: [
            {
              movieID: '550',
              movieTitle: 'Fight Club',
              movieLink: 'https://example.test/550',
              watchDate: new Date().toISOString().slice(0, 10),
              watched: false,
            },
          ],
        }),
      })
    );

    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      catchUp: { ok: true, sent: 1, skippedDuplicates: 0 },
    });
    expect(response.status).toBe(200);
    expect(snapshotStore.set).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not run catch-up delivery for later reminder snapshots', async () => {
    const { default: handler } = await import('../../../netlify/functions/save-reminders.mjs');
    const laterDate = new Date();
    laterDate.setUTCDate(laterDate.getUTCDate() + 3);

    const response = await handler(
      new Request('https://365movies.example.test/.netlify/functions/save-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          installationId: 'install-1',
          email: 'viewer@example.test',
          preference: 'email',
          movies: [
            {
              movieID: '550',
              movieTitle: 'Fight Club',
              watchDate: laterDate.toISOString().slice(0, 10),
              watched: false,
            },
          ],
        }),
      })
    );

    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      catchUp: { ok: true, sent: 0, skippedDuplicates: 0 },
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('skips save-time catch-up delivery when a sent marker exists', async () => {
    const { default: handler } = await import('../../../netlify/functions/save-reminders.mjs');
    sentMarkerStore.get.mockResolvedValueOnce(JSON.stringify({ sentAt: '2026-07-21T00:00:00.000Z' }));

    const response = await handler(
      new Request('https://365movies.example.test/.netlify/functions/save-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          installationId: 'install-1',
          email: 'viewer@example.test',
          preference: 'email',
          movies: [
            {
              movieID: '550',
              movieTitle: 'Fight Club',
              watchDate: new Date().toISOString().slice(0, 10),
              watched: false,
            },
          ],
        }),
      })
    );

    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      catchUp: { ok: true, sent: 0, skippedDuplicates: 1 },
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('keeps stored snapshots when catch-up delivery fails safely', async () => {
    const { default: handler } = await import('../../../netlify/functions/save-reminders.mjs');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      text: vi.fn().mockResolvedValue('service unavailable'),
    });

    const response = await handler(
      new Request('https://365movies.example.test/.netlify/functions/save-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          installationId: 'install-1',
          email: 'viewer@example.test',
          preference: 'email',
          movies: [
            {
              movieID: '550',
              movieTitle: 'Fight Club',
              watchDate: new Date().toISOString().slice(0, 10),
              watched: false,
            },
          ],
        }),
      })
    );

    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      warning: 'Reminder settings were saved, but immediate catch-up delivery could not be completed.',
    });
    expect(response.status).toBe(200);
    expect(snapshotStore.set).toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith('Immediate reminder catch-up failed after snapshot save.', expect.any(Error));
  });
});
