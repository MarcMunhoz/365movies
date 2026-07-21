import { getStore } from '@netlify/blobs';
import reminderCore from './reminderCore.js';

const {
  SNAPSHOT_STORE_NAME,
  buildSnapshotKey,
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

  return jsonResponse(200, {
    ok: true,
    installationId: validation.snapshot.installationId,
    movieCount: validation.snapshot.movies.length,
  });
};
