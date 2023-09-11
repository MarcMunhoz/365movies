<template>
  <q-page class="flex flex-center content-center justify-center p-3">
    <q-btn @click="clearCalendar" color="accent" push class="my-4">Clear calendar!</q-btn>

    <section class="w-full text-right mb-4">
      <q-chip outline color="primary" size="sm" :ripple="false" icon="circle" label="Has movie!" />
      <q-chip outline color="grey-7" size="sm" :ripple="false" icon="highlight_off" label="Unwatched" />
      <q-chip outline color="positive" size="sm" :ripple="false" icon="task_alt" label="Watched" />
      <q-chip outline color="negative" size="sm" :ripple="false" icon="delete" label="Delete from Agenda" />
    </section>

    <Calendar expanded borderless is-double-paned :columns="columns" :rows="5" :attributes="events" :min-date="minDate" :max-date="maxDate">
      <template #day-popover="{ attributes }">
        <ul>
          <li v-for="{ key, popover, customData } in attributes" :key="key" class="block text-primary border-dashed border-2 mt-5 first:mt-0" :class="{ 'text-positive': customData.watched }">
            <a :href="`https://www.imdb.com/title/${customData.movieId}`" target="movie" class="text-lg">{{ popover.label }}</a>
            <q-checkbox v-model="customData.watched" checked-icon="task_alt" unchecked-icon="highlight_off" color="positive" @click="markWatch(customData.movieId, customData.watched)">
              <q-tooltip v-if="customData.watched">Click to mark as not watched!</q-tooltip>
              <q-tooltip v-else>Click to mark as Watched!</q-tooltip>
            </q-checkbox>
            <q-btn flat round color="negative" icon="delete" @click="delMovieAgenda(customData.movieId)">
              <q-tooltip>Click to delete it from agenda!</q-tooltip>
            </q-btn>

            <section v-if="customData.streamingList.length">
              <p class="font-bold">
                Streaming list for
                <span class="bg-slate-200 p-1">{{ customData.streamingCountry }}</span>
              </p>
              <ul>
                <li v-for="stream in customData.streamingList" class="uppercase text-center">
                  <a :href="stream.link" target="_blank" class="underline underline-offset-1">{{ stream.service }}</a>
                </li>
              </ul>
            </section>

            <p v-else>
              Unavailable on streaming services in <span class="bg-slate-200 p-1">{{ customData.streamingCountry }}</span> ¯\_(ツ)_/¯
            </p>
          </li>
        </ul>
      </template>
    </Calendar>
  </q-page>
</template>

<script setup>
const { mapCurrent } = useScreens({ xs: "0px", sm: "640px", md: "768px", lg: "1024px" });
const columns = mapCurrent({ lg: 3 }, 1);
</script>

<script>
import { ref } from "vue";
import { Calendar } from "v-calendar";
import { useScreens } from "vue-screen-utils";
import "v-calendar/style.css";

export default {
  name: "Agenda",
  data() {
    return {
      events: ref([]),
      deleteMovie: ref(),
    };
  },
  mounted() {
    const months = document.querySelectorAll(".vc-title");

    months.forEach((e) => {
      // Create a new div element
      const divElement = document.createElement("div");
      divElement.className = "vc-title";
      divElement.innerHTML = e.innerHTML;

      // Replace the button with the new div
      return e.parentNode.replaceChild(divElement, e);
    });

    return this.addDates();
  },
  components: {
    Calendar,
  },
  methods: {
    addDates() {
      const watchMovies = localStorage.watchMovies ? JSON.parse(localStorage.watchMovies) : null;

      if (watchMovies) {
        watchMovies.forEach((e) => {
          const eventAdd = {
            highlight: true,
            dates: [],
            popover: {
              label: "",
              visibility: "click",
            },
            customData: {
              movieId: "",
              streamingCountry: String,
              streamingList: Array,
              watched: Boolean,
            },
          };

          eventAdd.popover.label = e.movieTitle;
          eventAdd.customData.movieId = e.movieID;
          eventAdd.customData.streamingCountry = e.streamingCountryName;
          eventAdd.customData.streamingList = e.streamingList;
          eventAdd.customData.watched = e.watched;
          eventAdd.dates.push(e.watchDate);

          return this.events.push(eventAdd);
        });
      }
    },
    markWatch(movieID, status) {
      let moviesList = JSON.parse(localStorage.getItem("watchMovies"));
      const movie = moviesList.find((movie) => movie.movieID === movieID);

      movie.watched = status;
      moviesList[moviesList.findIndex((oldMovie) => oldMovie.movieID === movieID)] = movie;

      localStorage.setItem("watchMovies", JSON.stringify(moviesList));
    },
    delMovieAgenda(movieID) {
      let moviesList = JSON.parse(localStorage.getItem("watchMovies"));

      moviesList = moviesList.filter((movie) => movie.movieID !== movieID);

      this.deleteMovie = moviesList;
      this.events = this.events.filter((event) => event.customData.movieId !== movieID);

      return this.$q.notify({
        type: "info",
        message: "Movie removed successful.",
      });
    },
    clearCalendar() {
      const hasMovies = localStorage.watchMovies ? true : false;
      let message = "There's no movies in Calendar.";

      hasMovies && (localStorage.removeItem("watchMovies"), (this.events.length = 0), (message = "Calendar is clear!"));

      return this.$q.notify({
        type: "info",
        message: message,
      });
    },
  },
  computed: {
    minDate() {
      return `${new Date().getFullYear()}-01-02`;
    },
    maxDate() {
      return `${new Date().getFullYear() + 1}-02-01`;
    },
  },
  watch: {
    deleteMovie: {
      // Watches the add movie action and appends the local storage with it
      handler(delMovieAgenda) {
        localStorage.watchMovies = JSON.stringify(delMovieAgenda);
      },
      deep: true,
    },
  },
};
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
