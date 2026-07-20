const { getStore } = require('@netlify/blobs');
const { schedule } = require('@netlify/functions');
const {
  REMINDER_OFFSET_DAYS,
  SENT_MARKER_STORE_NAME,
  SNAPSHOT_STORE_NAME,
  buildBrevoPayload,
  buildMissingBrevoConfigResponse,
  buildSentMarkerKey,
  findReminderMatches,
} = require('./reminderCore');

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const loadSnapshots = async (snapshotStore) => {
  const listed = await snapshotStore.list();
  const blobs = listed.blobs || [];
  const snapshots = [];

  for (const blob of blobs) {
    const snapshot = await snapshotStore.get(blob.key, { type: 'json' });

    if (snapshot) {
      snapshots.push(snapshot);
    }
  }

  return snapshots;
};

const sendBrevoEmail = async ({ apiKey, payload }) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo request failed with status ${response.status}: ${details}`);
  }
};

const runReminderDelivery = async ({ env = process.env, runDate = new Date(), dryRun = false } = {}) => {
  if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL || !env.BREVO_SENDER_NAME || !env.BREVO_APP_URL) {
    console.error('Brevo reminder configuration is missing.', buildMissingBrevoConfigResponse(env));
    return {
      ok: false,
      configurationError: buildMissingBrevoConfigResponse(env),
      sent: 0,
      skippedDuplicates: 0,
    };
  }

  const snapshotStore = getStore(SNAPSHOT_STORE_NAME);
  const sentMarkerStore = getStore(SENT_MARKER_STORE_NAME);
  const snapshots = await loadSnapshots(snapshotStore);
  let sent = 0;
  let skippedDuplicates = 0;

  for (const snapshot of snapshots) {
    const matches = findReminderMatches(snapshot, runDate);

    for (const movie of matches) {
      const markerKey = buildSentMarkerKey({
        installationId: snapshot.installationId,
        movieID: movie.movieID,
        watchDate: movie.watchDate,
        offsetDays: REMINDER_OFFSET_DAYS,
      });
      const existingMarker = await sentMarkerStore.get(markerKey);

      if (existingMarker) {
        skippedDuplicates += 1;
        continue;
      }

      const payload = buildBrevoPayload({
        snapshot,
        movie,
        appUrl: env.BREVO_APP_URL,
        senderEmail: env.BREVO_SENDER_EMAIL,
        senderName: env.BREVO_SENDER_NAME,
      });

      if (!dryRun) {
        await sendBrevoEmail({ apiKey: env.BREVO_API_KEY, payload });
        await sentMarkerStore.set(markerKey, JSON.stringify({ sentAt: new Date().toISOString() }));
      }

      sent += 1;
    }
  }

  return { ok: true, sent, skippedDuplicates, snapshots: snapshots.length, dryRun };
};

const handler = async (event) => {
  try {
    const dryRun = event?.queryStringParameters?.dryRun === 'true';
    const result = await runReminderDelivery({ dryRun });
    return jsonResponse(result.ok ? 200 : 500, result);
  } catch (error) {
    console.error('Scheduled reminder delivery failed.', error);
    return jsonResponse(500, { ok: false, error: 'Scheduled reminder delivery failed.' });
  }
};

exports.runReminderDelivery = runReminderDelivery;
exports.handler = schedule('@daily', handler);
