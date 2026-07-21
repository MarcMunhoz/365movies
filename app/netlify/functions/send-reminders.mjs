import { getStore } from '@netlify/blobs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  REMINDER_OFFSET_DAYS,
  SENT_MARKER_STORE_NAME,
  SNAPSHOT_STORE_NAME,
  buildBrevoPayload,
  buildMissingBrevoConfigResponse,
  buildSentMarkerKey,
  findReminderMatches,
} = require('./reminderCore.js');

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

export const runReminderDelivery = async ({ env = process.env, runDate = new Date(), dryRun = false } = {}) => {
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

export default async (request) => {
  try {
    const dryRun = new URL(request.url).searchParams.get('dryRun') === 'true';
    const result = await runReminderDelivery({ dryRun });
    return Response.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    console.error('Scheduled reminder delivery failed.', error);
    return Response.json({ ok: false, error: 'Scheduled reminder delivery failed.' }, { status: 500 });
  }
};

export const config = {
  schedule: '@daily',
};
