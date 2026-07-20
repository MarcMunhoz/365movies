const { getStore } = require('@netlify/blobs');
const {
  SNAPSHOT_STORE_NAME,
  buildSnapshotKey,
  validateReminderSnapshot,
} = require('./reminderCore');

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const parseBody = (event) => {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return null;
  }
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  const body = parseBody(event);

  if (body === null) {
    return jsonResponse(400, { error: 'Invalid JSON body.' });
  }

  if (event.httpMethod === 'DELETE') {
    const installationId = String(body.installationId || '').trim();

    if (!installationId) {
      return jsonResponse(400, { error: 'installationId is required.' });
    }

    const store = getStore(SNAPSHOT_STORE_NAME);
    await store.delete(buildSnapshotKey(installationId));
    return jsonResponse(200, { ok: true, disabled: true });
  }

  if (event.httpMethod !== 'POST') {
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
