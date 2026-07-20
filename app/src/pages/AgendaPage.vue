<template>
  <q-page data-cy="agenda-page" class="mx-auto w-full max-w-[1320px] px-3 pb-6 pt-4 md:px-5">
    <section class="mb-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-[rgba(10,18,30,0.62)] p-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="font-['Sora'] text-2xl font-bold text-[#e8f0f8] md:text-[1.75rem]">Agenda</h1>
        <p class="text-sm text-[#9db4c8]">Plan movies, update watch status, and keep your year organized.</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <q-btn data-cy="agenda-toggle-view" @click="listMode = !listMode" color="secondary" unelevated :icon="listMode ? 'calendar_month' : 'view_list'">
          {{ listMode ? "Calendar view" : "List view" }}
        </q-btn>
        <q-btn data-cy="agenda-clear-calendar" @click="clearCalendar" color="accent" outline icon="delete_sweep">Clear calendar</q-btn>
      </div>
    </section>

    <section class="mb-4 ml-auto rounded-xl border border-[#ffb58f4d] bg-[rgba(255,181,143,0.08)] p-2 leading-relaxed text-xs text-center text-[#ffd8c2] w-fit">
      <strong>Important:</strong> The agenda is local to each device/browser. If you switch devices or clear local data, your schedule will not be shared automatically.
    </section>

    <section data-cy="agenda-reminder-settings" class="mb-4 rounded-xl border border-white/10 bg-[rgba(11,19,31,0.74)] p-3">
      <div class="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="font-['Sora'] text-lg font-semibold text-[#e8f0f8]">Reminders</h2>
          <p class="text-sm text-[#9db4c8]">One setting for the whole agenda.</p>
        </div>

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

      <div class="grid gap-3 lg:grid-cols-[1fr_320px_auto] lg:items-end">
        <q-option-group
          v-model="selectedReminderPreference"
          data-cy="agenda-reminder-preference"
          color="primary"
          inline
          :options="reminderPreferenceOptions"
        />

        <q-input
          v-if="emailReminderSelected"
          v-model="reminderEmail"
          data-cy="agenda-reminder-email"
          filled
          dense
          type="email"
          label="Reminder e-mail"
          :error="emailReminderSelected && reminderEmail.length > 0 && !reminderEmailIsValid"
          error-message="Enter a valid e-mail address"
        />

        <q-btn
          data-cy="agenda-save-reminders"
          color="secondary"
          unelevated
          icon="notifications_active"
          :loading="reminderSyncing"
          @click="saveReminderSettings"
        >
          Save reminders
        </q-btn>
      </div>
    </section>

    <Challenge365 data-cy="challenge-365" :movie-logs="challengeMovieLogs" class="mb-4" />

    <section class="mb-4 flex flex-wrap items-center justify-center gap-2">
      <span class="text-xs uppercase">Legend</span>
      <q-chip outline color="primary" size="md" :ripple="false" :label="`Total: ${tableData.length}`" />
      <q-chip outline color="positive" size="md" :ripple="false" :label="`Watched: ${watchedMoviesCount}`" />
      <q-chip outline color="grey-7" size="md" :ripple="false" :label="`Unwatched: ${unwatchedMoviesCount}`" />
      <q-chip outline color="primary" size="md" :ripple="false" icon="circle" label="Scheduled movie" />
      <q-chip outline color="grey-7" size="md" :ripple="false" icon="radio_button_unchecked" label="Unwatched" />
      <q-chip outline color="positive" size="md" :ripple="false" icon="task_alt" label="Watched" />
      <q-chip outline color="secondary" size="md" :ripple="false" icon="edit" label="Date edit" />
      <q-chip outline color="negative" size="md" :ripple="false" icon="delete" label="Delete from Agenda" />
    </section>

    <section v-if="listMode" class="w-full overflow-hidden rounded-xl border border-white/10 bg-[rgba(11,19,31,0.74)]">
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

    <section v-else class="w-full overflow-hidden rounded-xl border border-white/10 bg-[rgba(11,19,31,0.74)] p-2 md:p-3">
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

    <q-dialog v-model="openAgendaDialog" persistent>
      <q-card class="min-h-[290px] min-w-[290px] max-w-[400px] border border-white/15 bg-[linear-gradient(180deg,#15263a_0%,#111f30_100%)] text-[#e4edf6]">
        <q-card-section class="flex flex-col justify-center text-[#d9e6f3]">
          <q-input filled disable v-model="editCountryNameMovie" label="Watching from" class="mb-4 w-full capitalize" />
          <q-date v-model="editDateMovie" :options="movieWatchDateOpt" subtitle="" :title="editMovieTitle" class="border border-white/15 bg-[rgba(17,31,48,0.95)] text-[#e7f0f8] [&_.q-date__header]:bg-[#4dc8b024] [&_.q-date__calendar-item]:text-[#dce8f5] [&_.q-date__view_.q-btn]:text-[#dce8f5]" />
        </q-card-section>

        <q-card-actions align="center" class="border-t border-white/10 bg-[rgba(8,15,24,0.72)]">
          <q-btn color="negative" @click="openAgendaDialog = false">Cancel</q-btn>
          <q-btn color="primary" @click="editMovieAgenda">Okay</q-btn>
        </q-card-actions>
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
import Challenge365 from "components/Challenge365.vue";
import { formatChallengeDate } from "utils/agendaDates";
import { buildAgendaIcs, getFutureUnwatchedAgendaItems } from "utils/calendarExport";
import {
  REMINDER_PREFERENCES,
  buildReminderSnapshot,
  getInstallationId,
  getOrCreateInstallationId,
  getReminderEmail,
  getReminderPreference,
  isCalendarReminderPreference,
  isEmailReminderPreference,
  isValidEmail,
  setReminderEmail,
  setReminderPreference,
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
const selectedReminderPreference = ref(getReminderPreference());
const reminderEmail = ref(getReminderEmail());
const reminderSyncing = ref(false);
let reminderSyncTimeout = null;

// Agenda list mode (table) state
const listMode = ref(true);
const tableData = ref([]);
const reminderFunctionBaseUrl = "/.netlify/functions";
const reminderPreferenceOptions = [
  { label: "None", value: REMINDER_PREFERENCES.none },
  { label: "E-mail", value: REMINDER_PREFERENCES.email },
  { label: "Calendar", value: REMINDER_PREFERENCES.calendar },
  { label: "Both", value: REMINDER_PREFERENCES.emailCalendar },
];

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

const emailReminderSelected = computed(() => isEmailReminderPreference(selectedReminderPreference.value));
const calendarExportEnabled = computed(() => isCalendarReminderPreference(selectedReminderPreference.value));
const reminderEmailIsValid = computed(() => isValidEmail(reminderEmail.value));
const calendarExportAvailable = computed(() => getFutureUnwatchedAgendaItems(watchMovies.value).length > 0);

const persistReminderSettings = () => {
  setReminderPreference(selectedReminderPreference.value);
  setReminderEmail(reminderEmail.value);
};

const buildCurrentReminderSnapshot = () =>
  buildReminderSnapshot({
    installationId: getOrCreateInstallationId(),
    email: reminderEmail.value,
    preference: selectedReminderPreference.value,
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

const syncEmailReminders = async ({ showNotification = false } = {}) => {
  if (!isEmailReminderPreference(selectedReminderPreference.value)) {
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
  if (!isEmailReminderPreference(selectedReminderPreference.value) || !isValidEmail(reminderEmail.value)) {
    return;
  }

  window.clearTimeout(reminderSyncTimeout);
  reminderSyncTimeout = window.setTimeout(() => {
    syncEmailReminders();
  }, 500);
};

const saveReminderSettings = async () => {
  if (emailReminderSelected.value && !reminderEmailIsValid.value) {
    Notify.create({ type: "warning", timeout: 3000, message: "Enter a valid e-mail address to enable e-mail reminders." });
    return;
  }

  persistReminderSettings();

  if (selectedReminderPreference.value === REMINDER_PREFERENCES.none || !emailReminderSelected.value) {
    try {
      await disableServerReminders();
      Notify.create({ type: "info", timeout: 2500, message: "Reminder settings saved." });
    } catch (error) {
      console.error("Reminder disable failed", error);
      Notify.create({ type: "warning", timeout: 3500, message: "Reminder preference saved locally. Server sync did not complete." });
    }
    return;
  }

  await syncEmailReminders({ showNotification: true });
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

watch(
  watchMovies,
  (newMovies) => {
    // Updates watchMovies in localStorage
    setLocalStorage("watchMovies", newMovies);
    scheduleReminderSync();
  },
  { deep: true }
);

watch([selectedReminderPreference, reminderEmail], persistReminderSettings);
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
