import { getStore } from '@netlify/blobs';
import reminderCore from './reminderCore.js';
import { deliverReminderSnapshots } from './send-reminders.mjs';

const {
  SNAPSHOT_STORE_NAME,
  buildSnapshotKey,
  findReminderMatches,
  validateReminderSnapshot,
} = reminderCore;

const jsonResponse = (status, body) =>
  Response.json(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
    },
  });

const parseBody = async (request) => {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
};

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  const body = await parseBody(request);

  if (body === null) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  if (request.method === 'DELETE') {
    const installationId = String(body.installationId || '').trim();

    if (!installationId) {
      return jsonResponse(400, { error: 'installationId is required.' });
    }

    const store = getStore(SNAPSHOT_STORE_NAME);
    await store.delete(buildSnapshotKey(installationId));
    return jsonResponse(200, { ok: true, disabled: true });
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const validation = validateReminderSnapshot(body);

  if (!validation.valid) {
    return jsonResponse(400, { error: validation.error });
  }

  const store = getStore(SNAPSHOT_STORE_NAME);
  await store.set(buildSnapshotKey(validation.snapshot.installationId), JSON.stringify(validation.snapshot));

  if (findReminderMatches(validation.snapshot).length === 0) {
    return jsonResponse(200, {
      ok: true,
      installationId: validation.snapshot.installationId,
      movieCount: validation.snapshot.movies.length,
      catchUp: {
        ok: true,
        sent: 0,
        skippedDuplicates: 0,
      },
    });
  }

  try {
    const catchUp = await deliverReminderSnapshots({ snapshots: [validation.snapshot] });

    if (!catchUp.ok) {
      return jsonResponse(200, {
        ok: true,
        installationId: validation.snapshot.installationId,
        movieCount: validation.snapshot.movies.length,
        warning: 'Reminder settings were saved, but immediate catch-up delivery could not be completed.',
        catchUp: {
          ok: false,
          sent: catchUp.sent,
          skippedDuplicates: catchUp.skippedDuplicates,
        },
      });
    }

    return jsonResponse(200, {
      ok: true,
      installationId: validation.snapshot.installationId,
      movieCount: validation.snapshot.movies.length,
      catchUp: {
        ok: true,
        sent: catchUp.sent,
        skippedDuplicates: catchUp.skippedDuplicates,
      },
    });
  } catch (error) {
    console.error('Immediate reminder catch-up failed after snapshot save.', error);
    return jsonResponse(200, {
      ok: true,
      installationId: validation.snapshot.installationId,
      movieCount: validation.snapshot.movies.length,
      warning: 'Reminder settings were saved, but immediate catch-up delivery could not be completed.',
    });
  }
};
