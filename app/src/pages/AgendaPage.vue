<template>
  <q-page class="flex flex-center content-start justify-center p-3">
    <q-btn @click="clearCalendar" color="accent" push class="my-4 mr-4">Clear calendar!</q-btn>
    <q-btn @click="listMode = !listMode" color="secondary" push class="my-4">{{ !listMode ? "List" : "Calendar" }} View</q-btn>

    <section class="w-full text-right mb-4">
      <q-chip outline color="primary" size="sm" :ripple="false" icon="circle" label="Scheduled movie" />
      <q-chip outline color="grey-7" size="sm" :ripple="false" icon="highlight_off" label="Unwatched" />
      <q-chip outline color="positive" size="sm" :ripple="false" icon="task_alt" label="Watched" />
      <q-chip outline color="secondary" size="sm" :ripple="false" icon="edit" label="Date edit" />
      <q-chip outline color="negative" size="sm" :ripple="false" icon="delete" label="Delete from Agenda" />
    </section>

    <section v-if="listMode" class="w-full">
      <q-table flat bordered :rows="tableData" :columns="tableColumns" row-key="movieId" rows-per-page-label="Movies per page" no-data-label="There are no movies planned" class="w-full">
        <template #body-cell-title="{ row }">
          <q-td>
            <a :href="row.movieLink" target="movie" class="text-lg text-primary">{{ row.title }} </a>
          </q-td>
        </template>

        <template #body-cell-watched="{ row }">
          <q-td class="text-center">
            <q-checkbox v-model="row.watched" checked-icon="task_alt" unchecked-icon="highlight_off" color="positive" @click="markWatch(row.movieId, row.watched)" />
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
              <p class="font-bold">
                <span class="bg-slate-200 p-1">
                  <template v-if="row.streamingCountry.length">{{ row.streamingCountry }}</template>
                  <template v-else>{{ row.streamingCountry.name }}</template>
                </span>
              </p>
              <ul class="flex flex-wrap flex-row justify-center gap-4 w-full">
                <li v-for="(stream, index) in row.streamingList" :key="stream.provider_id">
                  <img :src="`https://image.tmdb.org/t/p/w45${stream.logo_path}`" :title="stream.provider_name" class="rounded-full hover:border-2 hover:border-solid border-[#1976d3]" />
                </li>
              </ul>
            </div>
          </q-td>
        </template>
      </q-table>
    </section>

    <Calendar v-else expanded borderless is-double-paned :columns="columns" :rows="5" :attributes="events" :min-date="minDate" :max-date="maxDate">
      <template #day-popover="{ attributes }">
        <ul>
          <li v-for="{ key, popover, customData } in attributes" :key="key" class="block text-primary border-dashed border-2 mt-5 first:mt-0" :class="{ 'text-positive': customData.watched }">
            <a :href="customData.movieLink" target="movie" class="text-lg">{{ popover.label }}</a>
            <q-checkbox v-model="customData.watched" checked-icon="task_alt" unchecked-icon="highlight_off" color="positive" @click="markWatch(customData.movieId, customData.watched)">
              <q-tooltip v-if="customData.watched">Click to mark as not watched!</q-tooltip>
              <q-tooltip v-else>Click to mark as Watched!</q-tooltip>
            </q-checkbox>
            <q-btn flat round color="secondary" icon="edit" @click="openEditDialog(customData.movieId)"></q-btn>
            <q-btn flat round color="negative" icon="delete" @click="delMovieAgenda(customData.movieId)">
              <q-tooltip>Click to delete it from agenda!</q-tooltip>
            </q-btn>

            <section v-if="customData.streamingList.length">
              <p class="font-bold">
                Streaming list for
                <span class="bg-slate-200 p-1">
                  <template v-if="customData.streamingCountry.length">{{ customData.streamingCountry }}</template>
                  <template v-else>{{ customData.streamingCountry.name }}</template>
                </span>
              </p>
              <ul>
                <li v-for="stream in customData.streamingList" class="uppercase text-center">
                  {{ stream.provider_name }}
                </li>
              </ul>
            </section>
          </li>
        </ul>
      </template>
    </Calendar>

    <q-dialog v-model="openAgendaDialog" persistent>
      <q-card class="min-h-[290px] min-w-[290px] max-w-[400px]">
        <q-card-section class="flex justify-center">
          <q-input filled disable v-model="editCountryNameMovie" label="Watching from" class="w-full mb-4 capitalize" />
          <q-date v-model="editDateMovie" :options="movieWatchDateOpt" subtitle="" :title="editMovieTitle" />
        </q-card-section>

        <q-card-actions align="center" class="bg-white text-teal">
          <q-btn color="negative" @click="openAgendaDialog = false">Cancel</q-btn>
          <q-btn color="primary" @click="editMovieAgenda">Okay</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Calendar } from "v-calendar";
import { useScreens } from "vue-screen-utils";
import "v-calendar/style.css";
import { Notify } from "quasar";
import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";

const { mapCurrent } = useScreens({ xs: "0px", sm: "640px", md: "768px", lg: "1024px" });
const columns = mapCurrent({ lg: 3 }, 1);
const watchMovies = ref(getLocalStorage("watchMovies"));
const editMovieId = ref("");
const editMovieTitle = ref("");
const editCountryNameMovie = ref("");
const editDateMovie = ref("");
const events = ref([]);
const openAgendaDialog = ref(false);

// NEW CODE
const listMode = ref(getLocalStorage("listMode") === "true");
const tableData = ref([]);

// Definição das colunas da tabela
const tableColumns = [
  { name: "title", label: "Title", align: "left", field: "title", sortable: true, sort: (a, b) => a.localeCompare(b) },
  { name: "watchDate", label: "Watch Date", align: "center", field: "watchDate", sortable: true, sort: (a, b) => new Date(a) - new Date(b) },
  { name: "watched", label: "Watched", align: "center", field: "watched" },
  { name: "streaming", label: "Streaming", align: "center", field: "streamingList" },
  { name: "actions", label: "Actions", align: "center", field: "actions" },
];

const months = document.querySelectorAll(".vc-title");

months.forEach((e) => {
  // Create a new div element
  const divElement = document.createElement("div");
  divElement.className = "vc-title";
  divElement.innerHTML = e.innerHTML;

  // Replace the button with the new div
  return e.parentNode.replaceChild(divElement, e);
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

watch(
  [watchMovies.value, listMode],
  ([newMovies, newListMode]) => {
    // Updates watchMovies in localStorage
    setLocalStorage("watchMovies", newMovies);

    // Updates listMode in localStorage
    setLocalStorage("listMode", newListMode);
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
</style>
