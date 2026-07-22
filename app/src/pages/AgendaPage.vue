<template>
  <q-page data-cy="agenda-page" class="mx-auto w-full max-w-[1320px] px-3 pb-6 pt-4 md:px-5">
    <section class="mb-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-[rgba(10,18,30,0.62)] p-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="font-['Sora'] text-2xl font-bold text-[#e8f0f8] md:text-[1.75rem]">Agenda</h1>
        <p class="text-sm text-[#9db4c8]">Plan movies, update watch status, and keep your year organized.</p>
      </div>

      <div class="flex flex-col gap-2 md:items-end">
        <div class="flex flex-wrap gap-2">
          <q-btn data-cy="agenda-toggle-view" @click="listMode = !listMode" color="secondary" unelevated :icon="listMode ? 'calendar_month' : 'view_list'">
            {{ listMode ? "Calendar view" : "List view" }}
          </q-btn>
          <q-btn data-cy="agenda-clear-calendar" @click="clearCalendar" color="accent" outline icon="delete_sweep">Clear calendar</q-btn>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-xs text-[#9db4c8]" data-cy="agenda-context-legend">
          <span class="uppercase">Legend</span>
          <q-chip v-if="listMode" outline color="primary" size="sm" :ripple="false" :label="`Total: ${tableData.length}`" />
          <q-chip v-if="listMode" outline color="positive" size="sm" :ripple="false" :label="`Watched: ${watchedMoviesCount}`" />
          <q-chip v-if="listMode" outline color="grey-7" size="sm" :ripple="false" :label="`Unwatched: ${unwatchedMoviesCount}`" />
          <q-chip v-if="!listMode" outline color="primary" size="sm" :ripple="false" icon="circle" label="Scheduled" />
          <q-chip v-if="!listMode" outline color="positive" size="sm" :ripple="false" icon="task_alt" label="Watched" />
          <q-chip v-if="!listMode" outline color="grey-7" size="sm" :ripple="false" icon="radio_button_unchecked" label="Unwatched" />
        </div>
      </div>
    </section>

    <section data-cy="agenda-local-notice" class="agenda-local-notice mb-4 ml-auto rounded-xl p-2 leading-relaxed text-xs text-center w-fit">
      <strong>Important:</strong> The agenda is local to each device/browser. If you switch devices or clear local data, your schedule will not be shared automatically.
    </section>

    <section data-cy="agenda-reminder-settings" class="mb-4 rounded-xl border border-white/10 bg-[rgba(11,19,31,0.74)] p-3">
      <div class="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="font-['Sora'] text-lg font-semibold text-[#e8f0f8]">Reminders</h2>
          <p class="text-sm text-[#9db4c8]">Saved reminder settings for this browser.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <q-btn data-cy="agenda-edit-reminders" to="/settings" color="secondary" outline icon="settings">
            Settings
          </q-btn>
          <q-btn
            v-if="calendarExportEnabled"
            data-cy="agenda-export-calendar"
            color="primary"
            unelevated
            icon="event"
            :disable="!calendarExportAvailable"
            @click="exportAgendaCalendar"
          >
            Export calendar
          </q-btn>
        </div>
      </div>

      <div class="grid gap-2 text-sm text-[#dce8f5] md:grid-cols-2">
        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <span class="block text-xs uppercase tracking-[0.05em] text-[#9db4c8]">Method</span>
          <strong data-cy="agenda-reminder-method">{{ reminderPreferenceLabel }}</strong>
        </div>
        <div class="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <span class="block text-xs uppercase tracking-[0.05em] text-[#9db4c8]">E-mail</span>
          <strong data-cy="agenda-reminder-email-summary">{{ savedReminderEmail || "No e-mail saved" }}</strong>
        </div>
      </div>
    </section>

    <section v-if="listMode" data-cy="agenda-primary-content" class="w-full overflow-hidden rounded-xl border border-white/10 bg-[rgba(11,19,31,0.74)]">
      <q-table
        dark
        flat
        bordered
        :rows="tableData"
        :columns="tableColumns"
        row-key="movieId"
        rows-per-page-label="Movies per page"
        no-data-label="There are no movies planned"
        class="w-full bg-transparent text-[#dce8f5]"
      >
        <template #body-cell-title="{ row }">
          <q-td>
            <a :href="row.movieLink" target="movie" class="inline-flex w-fit items-center gap-2 truncate text-lg text-primary hover:underline">
              {{ row.title }}
              <q-icon name="open_in_new" size="16px" />
            </a>
          </q-td>
        </template>

        <template #body-cell-watched="{ row }">
          <q-td class="text-center">
            <q-checkbox
              v-model="row.watched"
              checked-icon="task_alt"
              unchecked-icon="radio_button_unchecked"
              color="positive"
              keep-color
              @click="markWatch(row.movieId, row.watched)"
            />
          </q-td>
        </template>

        <template #body-cell-actions="{ row }">
          <q-td class="text-center">
            <q-btn flat round color="secondary" icon="edit" @click="openEditDialog(row.movieId)" />
            <q-btn flat round color="negative" icon="delete" @click="delMovieAgenda(row.movieId)">
              <q-tooltip>Click to delete it from agenda!</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template #body-cell-streaming="{ row }">
          <q-td class="text-center">
            <div v-if="row.streamingList.length">
              <p class="mb-2 font-bold text-[#cde2f6]">
                <span class="rounded bg-[rgba(255,255,255,0.12)] px-2 py-1">
                  <template v-if="row.streamingCountry.length">{{ row.streamingCountry }}</template>
                  <template v-else>{{ row.streamingCountry.name }}</template>
                </span>
              </p>
              <ul class="flex w-full flex-wrap flex-row justify-center gap-2">
                <li v-for="stream in row.streamingList" :key="stream.provider_id">
                  <img :src="`https://image.tmdb.org/t/p/w45${stream.logo_path}`" :title="stream.provider_name" class="h-[36px] w-[36px] rounded-full border border-transparent transition-all duration-200 hover:border-[#1976d3]" />
                </li>
              </ul>
            </div>
            <div v-else class="text-[#8fa8bd]">N/A</div>
          </q-td>
        </template>
      </q-table>
    </section>

    <section v-else data-cy="agenda-primary-content" class="w-full overflow-hidden rounded-xl border border-white/10 bg-[rgba(11,19,31,0.74)] p-2 md:p-3">
      <Calendar expanded borderless is-double-paned :columns="columns" :rows="5" :attributes="events" :min-date="minDate" :max-date="maxDate">
        <template #day-popover="{ attributes }">
          <ul class="min-w-[230px]">
            <li
              v-for="{ key, popover, customData } in attributes"
              :key="key"
              class="mt-3 rounded-lg border border-dashed border-[rgba(25,118,211,0.45)] bg-[rgba(15,28,44,0.58)] p-2 text-primary first:mt-0"
              :class="{ 'border-[rgba(33,186,69,0.45)] text-positive': customData.watched }"
            >
              <div class="mb-2 flex items-start justify-between gap-2">
                <a :href="customData.movieLink" target="movie" class="text-lg leading-tight hover:underline">{{ popover.label }}</a>
                <div class="flex items-center">
                  <q-checkbox v-model="customData.watched" checked-icon="task_alt" unchecked-icon="radio_button_unchecked" color="positive" keep-color @click="markWatch(customData.movieId, customData.watched)">
                    <q-tooltip v-if="customData.watched">Click to mark as not watched!</q-tooltip>
                    <q-tooltip v-else>Click to mark as Watched!</q-tooltip>
                  </q-checkbox>
                  <q-btn flat round dense color="secondary" icon="edit" @click="openEditDialog(customData.movieId)" />
                  <q-btn flat round dense color="negative" icon="delete" @click="delMovieAgenda(customData.movieId)">
                    <q-tooltip>Click to delete it from agenda!</q-tooltip>
                  </q-btn>
                </div>
              </div>

              <section v-if="customData.streamingList.length" class="mt-2">
                <p class="mb-1 text-xs font-semibold uppercase tracking-[0.04em] text-[#9eb6cb]">
                  Streaming in
                  <span class="rounded bg-[rgba(255,255,255,0.12)] px-2 py-0.5 text-[#dce9f5]">
                    <template v-if="customData.streamingCountry.length">{{ customData.streamingCountry }}</template>
                    <template v-else>{{ customData.streamingCountry.name }}</template>
                  </span>
                </p>
                <ul class="grid grid-cols-1 gap-1">
                  <li v-for="stream in customData.streamingList" class="uppercase text-center text-xs text-[#c8dbec]">
                    {{ stream.provider_name }}
                  </li>
                </ul>
              </section>
            </li>
          </ul>
        </template>
      </Calendar>
    </section>

    <section data-cy="agenda-analytics-summary" class="mt-4 rounded-xl border border-white/10 bg-[rgba(11,19,31,0.74)] p-3">
      <div data-cy="agenda-challenge-summary" class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex items-start gap-3">
          <q-icon name="emoji_events" color="primary" size="28px" class="mt-1" />
          <div>
            <h2 class="font-['Sora'] text-lg font-semibold text-[#e8f0f8]">365 Movie Challenge</h2>
            <p class="text-sm text-[#9db4c8]">
              {{ challengeSummaryText }}
            </p>
          </div>
        </div>

        <q-btn data-cy="agenda-challenge-link" to="/challenge" color="primary" unelevated icon="open_in_new">
          Open challenge
        </q-btn>
      </div>
    </section>

    <q-dialog v-model="openAgendaDialog" persistent>
      <q-card class="min-h-[290px] min-w-[290px] max-w-[400px] border border-white/15 bg-[linear-gradient(180deg,#15263a_0%,#111f30_100%)] text-[#e4edf6]">
        <q-form @submit.prevent="editMovieAgenda">
          <q-card-section class="flex flex-col justify-center text-[#d9e6f3]">
            <q-input filled disable v-model="editCountryNameMovie" label="Watching from" class="mb-4 w-full capitalize" />
            <q-date v-model="editDateMovie" :options="movieWatchDateOpt" subtitle="" :title="editMovieTitle" class="border border-white/15 bg-[rgba(17,31,48,0.95)] text-[#e7f0f8] [&_.q-date__header]:bg-[#4dc8b024] [&_.q-date__calendar-item]:text-[#dce8f5] [&_.q-date__view_.q-btn]:text-[#dce8f5]" />
          </q-card-section>

          <q-card-actions align="center" class="border-t border-white/10 bg-[rgba(8,15,24,0.72)]">
            <q-btn color="negative" type="button" @click="openAgendaDialog = false">Cancel</q-btn>
            <q-btn color="primary" type="submit">Okay</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { Calendar } from "v-calendar";
import { useScreens } from "vue-screen-utils";
import "v-calendar/style.css";
import { Notify } from "quasar";
import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";
import { formatChallengeDate } from "utils/agendaDates";
import { buildAgendaIcs, getFutureUnwatchedAgendaItems } from "utils/calendarExport";
import {
  REMINDER_PREFERENCES,
  buildReminderSnapshot,
  getOrCreateInstallationId,
  getReminderEmail,
  getReminderPreference,
  isCalendarReminderPreference,
  isEmailReminderPreference,
} from "utils/reminderPreferences";

const { mapCurrent } = useScreens({ xs: "0px", sm: "640px", md: "768px", lg: "1024px" });
const columns = mapCurrent({ lg: 3 }, 1);
const watchMovies = ref(getLocalStorage("watchMovies"));
const editMovieId = ref("");
const editMovieTitle = ref("");
const editCountryNameMovie = ref("");
const editDateMovie = ref("");
const events = ref([]);
const openAgendaDialog = ref(false);
const savedReminderPreference = ref(getReminderPreference());
const savedReminderEmail = ref(getReminderEmail());
const reminderSyncing = ref(false);
let reminderSyncTimeout = null;

// Agenda list mode (table) state
const listMode = ref(true);
const tableData = ref([]);
const reminderFunctionBaseUrl = "/.netlify/functions";
const reminderPreferenceLabels = {
  [REMINDER_PREFERENCES.none]: "None",
  [REMINDER_PREFERENCES.email]: "E-mail",
  [REMINDER_PREFERENCES.calendar]: "Calendar",
  [REMINDER_PREFERENCES.emailCalendar]: "Both",
};

// Definição das colunas da tabela
const tableColumns = [
  { name: "title", label: "Title", align: "left", field: "title", sortable: true, sort: (a, b) => a.localeCompare(b) },
  { name: "watchDate", label: "Watch Date", align: "center", field: "watchDate", sortable: true, sort: (a, b) => new Date(a) - new Date(b) },
  { name: "watched", label: "Watched", align: "center", field: "watched" },
  { name: "streaming", label: "Streaming", align: "center", field: "streamingList" },
  { name: "actions", label: "Actions", align: "center", field: "actions" },
];

onMounted(async () => {
  listMode.value = true;
  localStorage.removeItem("listMode");

  await nextTick();
  const months = document.querySelectorAll(".vc-title");
  months.forEach((e) => {
    const divElement = document.createElement("div");
    divElement.className = "vc-title";
    divElement.innerHTML = e.innerHTML;
    return e.parentNode.replaceChild(divElement, e);
  });
});

const clearCalendar = () => {
  const hasMovies = watchMovies.value ? true : false;
  let message = "There's no movies in Calendar.";

  hasMovies && ((watchMovies.value.length = 0), (events.value.length = 0), (tableData.value.length = 0), (message = "Calendar is clear!"));

  return Notify.create({
    type: "info",
    message: message,
  });
};

const calendarExportEnabled = computed(() => isCalendarReminderPreference(savedReminderPreference.value));
const calendarExportAvailable = computed(() => getFutureUnwatchedAgendaItems(watchMovies.value).length > 0);
const reminderPreferenceLabel = computed(() => reminderPreferenceLabels[savedReminderPreference.value] || reminderPreferenceLabels[REMINDER_PREFERENCES.none]);

const buildCurrentReminderSnapshot = () =>
  buildReminderSnapshot({
    installationId: getOrCreateInstallationId(),
    email: savedReminderEmail.value,
    preference: savedReminderPreference.value,
    movies: watchMovies.value,
  });

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

const syncEmailReminders = async ({ showNotification = false } = {}) => {
  savedReminderPreference.value = getReminderPreference();
  savedReminderEmail.value = getReminderEmail();

  if (!isEmailReminderPreference(savedReminderPreference.value)) {
    return;
  }

  reminderSyncing.value = true;

  try {
    await postReminderSnapshot(buildCurrentReminderSnapshot());

    if (showNotification) {
      Notify.create({ type: "positive", timeout: 2500, message: "E-mail reminders saved." });
    }
  } catch (error) {
    console.error("Reminder sync failed", error);
    Notify.create({ type: "negative", timeout: 3500, message: "Could not sync e-mail reminders." });
  } finally {
    reminderSyncing.value = false;
  }
};

const scheduleReminderSync = () => {
  savedReminderPreference.value = getReminderPreference();
  savedReminderEmail.value = getReminderEmail();

  if (!isEmailReminderPreference(savedReminderPreference.value) || !savedReminderEmail.value) {
    return;
  }

  window.clearTimeout(reminderSyncTimeout);
  reminderSyncTimeout = window.setTimeout(() => {
    syncEmailReminders();
  }, 500);
};

const exportAgendaCalendar = () => {
  const futureMovies = getFutureUnwatchedAgendaItems(watchMovies.value);

  if (futureMovies.length === 0) {
    Notify.create({ type: "info", timeout: 2500, message: "No future unwatched movies to export." });
    return;
  }

  getOrCreateInstallationId();

  const calendarFile = buildAgendaIcs(watchMovies.value);
  const url = URL.createObjectURL(new Blob([calendarFile], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "365movies-agenda.ics";
  link.click();
  URL.revokeObjectURL(url);
};

const addDates = () => {
  if (watchMovies.value !== null) {
    watchMovies.value.forEach((e) => {
      const eventAdd = {
        highlight: true,
        isInteractive: true,
        dates: [],
        popover: {
          label: "",
          visibility: "click",
        },
        customData: {
          movieId: "",
          movieLink: "",
          streamingCountry: String,
          streamingList: Array,
          watched: Boolean,
        },
      };

      eventAdd.popover.label = e.movieTitle;
      eventAdd.customData.movieId = e.movieID;
      eventAdd.customData.movieLink = e.movieLink;
      eventAdd.customData.streamingCountry = e.streamingCountryName;
      eventAdd.customData.streamingList = e.streamingList;
      eventAdd.customData.watched = e.watched;
      eventAdd.dates.push(e.watchDate);

      events.value.push(eventAdd);

      // Defines table rows
      tableData.value.push({
        movieId: eventAdd.customData.movieId,
        movieLink: eventAdd.customData.movieLink,
        title: eventAdd.popover.label,
        watchDate: new Date(e.watchDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        watched: eventAdd.customData.watched,
        streamingList: eventAdd.customData.streamingList,
        streamingCountry: eventAdd.customData.streamingCountry,
      });
    });
  }
};

addDates(); // Populates calendar on MOUNTED

const markWatch = (movieID, status) => {
  let markMovie = events.value.filter((event) => event.customData.movieId === movieID)[0];

  markMovie.customData.watched = status;
  tableData.value.find((movie) => movie.movieId === movieID).watched = status;
  watchMovies.value.find((movie) => movie.movieID === movieID).watched = status;
};

const movieWatchDateOpt = (movieWatchDateOpt) => {
  return movieWatchDateOpt >= new Date().toISOString().split("T")[0].replace(/-/g, "/");
};

const openEditDialog = (movieID) => {
  const movie = watchMovies.value.find((movie) => movie.movieID === movieID);

  editMovieId.value = movieID;
  editDateMovie.value = movie.watchDate;
  editCountryNameMovie.value = movie.streamingCountryName;
  editMovieTitle.value = movie.movieTitle;

  return (openAgendaDialog.value = true);
};

const editMovieAgenda = () => {
  let movieEdit = events.value.filter((event) => event.customData.movieId === editMovieId.value)[0];

  movieEdit.dates = editDateMovie.value;
  watchMovies.value.find((movie) => movie.movieID === editMovieId.value).watchDate = editDateMovie.value;
  tableData.value.find((movie) => movie.movieId === editMovieId.value).watchDate = new Date(editDateMovie.value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  openAgendaDialog.value = false;

  return Notify.create({
    type: "positive",
    timeout: 2500,
    message: "Movie edited successful.",
  });
};

const delMovieAgenda = (movieID) => {
  let moviesList = JSON.parse(localStorage.getItem("watchMovies"));

  moviesList = moviesList.filter((movie) => movie.movieID !== movieID);

  watchMovies.value = moviesList;
  events.value = events.value.filter((event) => event.customData.movieId !== movieID);
  tableData.value = tableData.value.filter((event) => event.movieId !== movieID);

  return Notify.create({
    type: "info",
    timeout: 2500,
    message: "Movie removed successful.",
  });
};

const minDate = computed(() => {
  return `${new Date().getFullYear()}-01-02`;
});

const maxDate = computed(() => {
  return `${new Date().getFullYear() + 1}-02-01`;
});

const watchedMoviesCount = computed(() => tableData.value.filter((movie) => movie.watched).length);
const unwatchedMoviesCount = computed(() => tableData.value.length - watchedMoviesCount.value);

const challengeMovieLogs = computed(() =>
  (watchMovies.value ?? [])
    .filter((movie) => movie.watched)
    .map((movie) => ({
      id: String(movie.movieID),
      title: movie.movieTitle,
      watchedAt: formatChallengeDate(movie.watchDate),
    }))
    .filter((movie) => movie.watchedAt !== "")
);

const challengeSummaryText = computed(() => {
  const watchedCount = challengeMovieLogs.value.length;
  const plannedCount = tableData.value.length;
  const watchedLabel = watchedCount === 1 ? "movie watched" : "movies watched";
  const plannedLabel = plannedCount === 1 ? "movie planned" : "movies planned";

  return `${watchedCount} ${watchedLabel} this year from ${plannedCount} ${plannedLabel}. Open the full challenge for the yearly grid, metrics, and streaks.`;
});

watch(
  watchMovies,
  (newMovies) => {
    // Updates watchMovies in localStorage
    setLocalStorage("watchMovies", newMovies);
    scheduleReminderSync();
  },
  { deep: true }
);

</script>

<style lang="scss" scoped>
:deep(.vc-pane-container) {
  .vc-pane {
    border: 1px solid $primary;
  }

  .vc-title {
    cursor: auto;
  }

  .vc-arrow {
    display: none;
  }
}

:deep(.vc-popover-content-wrapper) {
  pointer-events: initial;
}

:deep(.q-date__header-subtitle) {
  display: none;
}
</style>
