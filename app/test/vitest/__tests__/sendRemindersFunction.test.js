import { beforeEach, describe, expect, it, vi } from 'vitest';

const snapshotStore = {
  list: vi.fn(),
  get: vi.fn(),
};
const sentMarkerStore = {
  get: vi.fn(),
  set: vi.fn(),
};

vi.mock('@netlify/blobs', () => ({
  getStore: vi.fn((name) => (name === 'agenda-reminder-snapshots' ? snapshotStore : sentMarkerStore)),
}));

describe('send-reminders function', () => {
  beforeEach(() => {
    snapshotStore.list.mockReset();
    snapshotStore.get.mockReset();
    sentMarkerStore.get.mockReset();
    sentMarkerStore.set.mockReset();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(''),
    });
  });

  it('runs reminder delivery for the inclusive catch-up window', async () => {
    const { runReminderDelivery } = await import('../../../netlify/functions/send-reminders.mjs');
    snapshotStore.list.mockResolvedValue({ blobs: [{ key: 'install-1.json' }] });
    snapshotStore.get.mockResolvedValue({
      installationId: 'install-1',
      email: 'viewer@example.test',
      preference: 'email',
      movies: [
        {
          movieID: '550',
          movieTitle: 'Fight Club',
          movieLink: 'https://example.test/550',
          watchDate: '2026-07-21',
          watched: false,
        },
        {
          movieID: '551',
          movieTitle: 'Arrival',
          movieLink: 'https://example.test/551',
          watchDate: '2026-07-22',
          watched: false,
        },
        {
          movieID: '552',
          movieTitle: 'Heat',
          movieLink: 'https://example.test/552',
          watchDate: '2026-07-23',
          watched: false,
        },
        {
          movieID: '553',
          movieTitle: 'Later',
          movieLink: 'https://example.test/553',
          watchDate: '2026-07-24',
          watched: false,
        },
      ],
    });
    sentMarkerStore.get.mockResolvedValue(null);

    const result = await runReminderDelivery({
      env: {
        BREVO_API_KEY: 'secret',
        BREVO_SENDER_EMAIL: 'sender@example.test',
        BREVO_SENDER_NAME: '365movies',
        BREVO_APP_URL: 'https://365movies.example.test',
      },
      runDate: new Date(Date.UTC(2026, 6, 21)),
      dryRun: true,
    });

    expect(result).toMatchObject({ ok: true, sent: 3, skippedDuplicates: 0, snapshots: 1, dryRun: true });
    expect(sentMarkerStore.set).not.toHaveBeenCalled();
  });

  it('skips reminders when the catch-up or legacy marker already exists', async () => {
    const { runReminderDelivery } = await import('../../../netlify/functions/send-reminders.mjs');
    snapshotStore.list.mockResolvedValue({ blobs: [{ key: 'install-1.json' }] });
    snapshotStore.get.mockResolvedValue({
      installationId: 'install-1',
      email: 'viewer@example.test',
      preference: 'email',
      movies: [
        {
          movieID: '550',
          movieTitle: 'Fight Club',
          movieLink: 'https://example.test/550',
          watchDate: '2026-07-23',
          watched: false,
        },
      ],
    });
    sentMarkerStore.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify({ sentAt: '2026-07-21T00:00:00.000Z' }));

    const result = await runReminderDelivery({
      env: {
        BREVO_API_KEY: 'secret',
        BREVO_SENDER_EMAIL: 'sender@example.test',
        BREVO_SENDER_NAME: '365movies',
        BREVO_APP_URL: 'https://365movies.example.test',
      },
      runDate: new Date(Date.UTC(2026, 6, 21)),
    });

    expect(result).toMatchObject({ ok: true, sent: 0, skippedDuplicates: 1 });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
