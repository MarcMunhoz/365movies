<template>
  <q-page class="settings-page px-4 py-5 md:px-8 md:py-8">
    <section class="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <header class="settings-hero">
        <p class="settings-kicker">{{ t("navigation.settings") }}</p>
        <h1>{{ t("settings.title") }}</h1>
        <p>{{ t("settings.subtitle") }}</p>
      </header>

      <section class="settings-section">
        <div>
          <h2>{{ t("settings.sections.appearance.title") }}</h2>
          <p>{{ t("settings.sections.appearance.description") }}</p>
        </div>

        <q-btn-toggle
          v-model="selectedTheme"
          spread
          unelevated
          toggle-color="primary"
          class="settings-toggle"
          :options="themeOptions"
          @update:model-value="saveTheme"
        />
      </section>

      <section class="settings-section">
        <div>
          <h2>{{ t("settings.sections.accessibility.title") }}</h2>
          <p>{{ t("settings.sections.accessibility.description") }}</p>
        </div>

        <q-banner rounded class="settings-banner">
          {{ t("settings.accessibility.status") }}
        </q-banner>
      </section>

      <section class="settings-section">
        <div>
          <h2>{{ t("settings.sections.reminders.title") }}</h2>
          <p>{{ t("settings.sections.reminders.description") }}</p>
        </div>

        <div data-cy="settings-reminder-summary" class="settings-summary">
          <div>
            <span>{{ t("settings.reminders.savedMethod") }}</span>
            <strong>{{ reminderPreferenceLabel(savedReminderPreference) }}</strong>
          </div>
          <div>
            <span>{{ t("settings.reminders.savedEmail") }}</span>
            <strong>{{ savedReminderEmail || t("settings.reminders.noEmail") }}</strong>
          </div>
        </div>

        <q-form v-if="reminderEditing" data-cy="settings-reminder-form" class="settings-form" @submit.prevent="saveReminderSettings">
          <q-option-group
            v-model="draftReminder.preference"
            data-cy="settings-reminder-preference"
            color="primary"
            inline
            :options="reminderPreferenceOptions"
          />

          <q-input
            v-model="draftReminder.email"
            data-cy="settings-reminder-email"
            filled
            dense
            hide-bottom-space
            type="email"
            :label="t('settings.reminders.emailLabel')"
            :error="draftEmailRequired && draftReminder.email.length > 0 && !draftEmailIsValid"
            :error-message="t('settings.reminders.invalidEmail')"
          />

          <div class="flex flex-wrap justify-end gap-2">
            <q-btn data-cy="settings-cancel-reminders" color="negative" outline type="button" @click="cancelReminderEdit">
              {{ t("settings.reminders.cancel") }}
            </q-btn>
            <q-btn data-cy="settings-save-reminders" color="primary" unelevated icon="notifications_active" type="submit" :loading="reminderSyncing">
              {{ t("settings.reminders.save") }}
            </q-btn>
          </div>
        </q-form>

        <q-btn v-else data-cy="settings-edit-reminders" color="primary" outline icon="edit" class="self-start" @click="startReminderEdit">
          {{ t("settings.reminders.edit") }}
        </q-btn>
      </section>
    </section>
  </q-page>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { Notify, useQuasar } from "quasar";
import { getLocalStorage } from "composables/useLocalStorage";
import {
  APP_THEME_OPTIONS,
  applyThemePreference,
  createReminderEditState,
  getThemePreference,
  setThemePreference,
} from "utils/appPreferences";
import { useTranslations } from "composables/useTranslations";
import {
  REMINDER_PREFERENCES,
  buildReminderSnapshot,
  getInstallationId,
  getOrCreateInstallationId,
  getReminderEmail,
  getReminderPreference,
  isEmailReminderPreference,
  isValidEmail,
  setReminderEmail,
  setReminderPreference,
} from "utils/reminderPreferences";

const reminderFunctionBaseUrl = "/.netlify/functions";

export default defineComponent({
  name: "SettingsPage",

  setup() {
    const $q = useQuasar();
    const { t } = useTranslations();
    const selectedTheme = ref(getThemePreference());
    const savedReminderPreference = ref(getReminderPreference());
    const savedReminderEmail = ref(getReminderEmail());
    const reminderEditing = ref(false);
    const reminderSyncing = ref(false);
    const draftReminder = ref(createReminderEditState({
      preference: savedReminderPreference.value,
      email: savedReminderEmail.value,
    }));

    const themeOptions = computed(() => [
      { label: t("settings.theme.dark"), value: APP_THEME_OPTIONS.dark },
      { label: t("settings.theme.light"), value: APP_THEME_OPTIONS.light },
    ]);

    const reminderPreferenceOptions = computed(() =>
      Object.values(REMINDER_PREFERENCES).map((preference) => ({
        label: t(`reminders.preference.${preference}`),
        value: preference,
      }))
    );
    const draftEmailRequired = computed(() => isEmailReminderPreference(draftReminder.value.preference));
    const draftEmailIsValid = computed(() => isValidEmail(draftReminder.value.email));

    const saveTheme = (theme) => {
      selectedTheme.value = applyThemePreference(setThemePreference(theme), $q);
    };

    const reminderPreferenceLabel = (preference) => t(`reminders.preference.${preference}`);

    const startReminderEdit = () => {
      draftReminder.value = createReminderEditState({
        preference: savedReminderPreference.value,
        email: savedReminderEmail.value,
      });
      reminderEditing.value = true;
    };

    const cancelReminderEdit = () => {
      draftReminder.value = createReminderEditState({
        preference: savedReminderPreference.value,
        email: savedReminderEmail.value,
      });
      reminderEditing.value = false;
    };

    const postReminderSnapshot = async (snapshot) => {
      const response = await fetch(`${reminderFunctionBaseUrl}/save-reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });

      if (!response.ok) {
        throw new Error("Reminder sync failed");
      }
    };

    const disableServerReminders = async () => {
      const installationId = getInstallationId();

      if (!installationId) {
        return;
      }

      const response = await fetch(`${reminderFunctionBaseUrl}/save-reminders`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installationId }),
      });

      if (!response.ok) {
        throw new Error("Reminder disable failed");
      }
    };

    const saveReminderSettings = async () => {
      if (draftEmailRequired.value && !draftEmailIsValid.value) {
        Notify.create({ type: "warning", timeout: 3000, message: t("settings.reminders.emailRequired") });
        return;
      }

      reminderSyncing.value = true;
      const nextPreference = setReminderPreference(draftReminder.value.preference);
      const nextEmail = setReminderEmail(draftReminder.value.email);
      savedReminderPreference.value = nextPreference;
      savedReminderEmail.value = nextEmail;

      try {
        if (!isEmailReminderPreference(nextPreference)) {
          await disableServerReminders();
          Notify.create({ type: "info", timeout: 2500, message: t("settings.reminders.saved") });
        } else {
          await postReminderSnapshot(
            buildReminderSnapshot({
              installationId: getOrCreateInstallationId(),
              email: nextEmail,
              preference: nextPreference,
              movies: getLocalStorage("watchMovies"),
            })
          );
          Notify.create({ type: "positive", timeout: 2500, message: t("settings.reminders.emailSaved") });
        }
        reminderEditing.value = false;
      } catch (error) {
        console.error("Reminder settings sync failed", error);
        Notify.create({
          type: isEmailReminderPreference(nextPreference) ? "negative" : "warning",
          timeout: 3500,
          message: isEmailReminderPreference(nextPreference)
            ? t("settings.reminders.syncFailed")
            : t("settings.reminders.disableFailed"),
        });
      } finally {
        reminderSyncing.value = false;
      }
    };

    return {
      cancelReminderEdit,
      draftEmailIsValid,
      draftEmailRequired,
      draftReminder,
      reminderEditing,
      reminderPreferenceLabel,
      reminderPreferenceOptions,
      reminderSyncing,
      saveReminderSettings,
      saveTheme,
      savedReminderEmail,
      savedReminderPreference,
      selectedTheme,
      startReminderEdit,
      t,
      themeOptions,
    };
  },
});
</script>
