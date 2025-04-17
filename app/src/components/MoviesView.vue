<template>
  <q-page class="w-full px-5">
    <div class="row w-full">
      <q-input v-model="searchTerm" label="Type a movie title portion and press ENTER" lazy-rules :rules="searchRules" @keyup.enter="(luckyMethod = false), sFnmovies()" class="w-full" />
    </div>
    <div class="row w-full">
      <q-btn depressed small color="primary" class="mx-auto mb-5 w-25" :disable="searchTerm.length < 3" @click="(luckyMethod = false), sFnmovies()">Movie Search</q-btn>
      <q-btn depressed small color="primary" class="mx-auto mb-5 w-25" @click="(luckyMethod = true), sFnmovies()">I'm lucky</q-btn>
    </div>
    <div class="row w-full" v-if="progressLoader === true">
      <q-circular-progress size="2rem" color="primary" class="mx-auto" indeterminate></q-circular-progress>
      <p class="text-center text-lg font-bold text-primary animate-pulse mt-2 w-full">Please, wait...</p>
    </div>

    <section v-else class="flex flex-wrap justify-center gap-3 mt-5">
      <q-card v-for="(sMovie, i) in sortedMovies" :key="i" class="relative w-[374px] max-w-[374px]">
        <img v-if="sMovie.poster_path != null" :src="`https://image.tmdb.org/t/p/w300${sMovie.poster_path}`" class="object-cover h-[250px]" />
        <img v-else src="/img/no-image.jpg" class="object-cover h-[250px]" />

        <div class="absolute top-[220px] right-[20px] flex gap-x-4">
          <q-fab color="primary" icon="keyboard_arrow_down" direction="down" class="opacity-90">
            <q-fab-action
              v-for="btn in agendaButtons"
              color="accent"
              @click="
                switch (btn.label) {
                  case 'Delete':
                    delMovieAgenda(sMovie.id, sMovie.title);
                    break;
                  default:
                    movieBtnAction(btn.label, sMovie.title, sMovie.id);
                }
              "
              :icon="btn.icon"
              :label="btn.label"
              :class="showHiddenBtns(sMovie.id, btn.label)"
            />
          </q-fab>

          <q-btn
            v-if="sMovie.imdbId !== 'Unknown'"
            icon="assignment"
            color="primary"
            class="white--text opacity-75"
            :href="`https://www.imdb.com/title/${sMovie.imdbId}`"
            target="movie"
            title="Go to IMDb"
            fab
            small
          />
        </div>

        <q-card-section class="flex justify-around">
          <div class="text-h6 w-full">{{ sMovie.title }}</div>

          <template v-if="sMovie.vote_average != null">
            <q-rating :model-value="Number(sMovie.vote_average)" color="amber" icon-half="star_half" readonly max="10" size="1.4em" class="w-50"></q-rating>
            <q-tooltip class="bg-primary" anchor="bottom middle" self="center middle">
              {{ sMovie.vote_average }}
            </q-tooltip>
          </template>

          <div class="grey--text p-0 w-auto">
            {{ sMovie.release_date.split("-")[0] }}
          </div>
          <div v-if="getRuntime(sMovie.id) > 0" class="grey--text pl-0 w-auto">{{ getRuntime(sMovie.id) }}min</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle-1 w-100"><strong>Director:</strong> {{ getDirector(sMovie.id) }}</div>

          <div class="text-subtitle-1 w-100"><strong>Actors:</strong> {{ getActors(sMovie.id)?.join(", ") || "N/A" }}</div>

          <div class="text-subtitle-1 w-100"><strong>Genres:</strong> {{ getGenres(sMovie.id)?.join(", ") || "N/A" }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none mt-3">
          <q-btn v-if="getTrailer(sMovie.id).length" icon="smart_display" color="primary" class="block mb-4" @click="openTrailerDialog(getTrailer(sMovie.id))">&nbsp;Trailer</q-btn>
          <q-btn v-else outline color="negative" class="block mb-4" disable label="NO TRAILER" />
          <template v-if="sMovie.overview">{{ sMovie.overview }}</template>
          <template v-else>N/A</template>
        </q-card-section>
      </q-card>
    </section>

    <div v-if="noMovie === true" class="text-center">
      <img src="/img/not-found.gif" class="mt-3 w-[300px] mx-auto" />
    </div>

    <Trailers ref="trailerDialog" :trailer-id="dialogTrailerId" />
    <AddEditMovie
      ref="AddEditMovieDialog"
      :dialog-action="dialogAction"
      :movie-watch-date="movieWatchDate"
      :movie-id="movieTmdbId"
      :movie-title="dialogTitle"
      :movie-providers="sMoviesProviders.filter((provider) => provider.id === movieTmdbId)"
    />
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { Dialog, Notify } from "quasar";
import { commonWords } from "utils/commonWords";
import { useTmdb } from "composables/useTmdb";
import { useMovieData } from "composables/useMovieData";
import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";
import { today } from "utils/dateToday";
import Trailers from "components/Trailers.vue";
import AddEditMovie from "components/AddEditMovie.vue";

const searchTerm = ref("");
const searchRules = ref([(value) => (value && value.length >= 3) || "Min 3 characters"]);
const dialogAction = ref("");
const dialogTitle = ref("");
const luckyMethod = ref(Boolean);
const movieTmdbId = ref(0);
const movieWatchDate = ref("");
const noMovie = ref(false);
const progressLoader = ref(false);
const watchMovies = ref([]);

const { fetch } = useTmdb();
const sMoviesCredits = ref([]);
const sMoviesDetails = ref([]);
const sMoviesProviders = ref([]);
const sMoviesVideos = ref([]);
const sMovies = ref([]);
const agendaButtons = ref([
  {
    icon: "event",
    label: "Add",
  },
  {
    icon: "edit_calendar",
    label: "Edit",
  },
  {
    icon: "event_busy",
    label: "Delete",
  },
]);
const trailerDialog = ref();
const dialogTrailerId = ref();
const AddEditMovieDialog = ref();
const { getMovieData } = useMovieData(sMoviesCredits, sMoviesDetails, sMoviesProviders, sMoviesVideos);

const sFnmovies = async () => {
  // Resetando estado
  sMovies.value = [];
  sMoviesDetails.value = [];
  sMoviesCredits.value = [];
  sMoviesProviders.value = [];
  sMoviesVideos.value = [];
  noMovie.value = false;
  progressLoader.value = true;

  // Breaks if search field wrong
  if ((!searchTerm.value && !luckyMethod.value) || (searchTerm.value.length < 3 && !luckyMethod.value)) {
    return false;
  }

  luckyMethod.value && (searchTerm.value = getRandomWord());

  // Fazendo a busca
  const data = await fetch("search/movie", { query: searchTerm.value });
  const movies = data?.results || [];

  if (movies.length) {
    await Promise.all(
      movies.map(async (movie) => {
        await sFnmoviesInfo(movie.id);
        movie.imdbId = getImdb(movie.id);

        sMovies.value.push(movie); // Adiciona só depois de carregar os detalhes
      })
    );
  } else {
    noMovie.value = true;
  }

  progressLoader.value = false;
};

const sFnmoviesInfo = async (movieId) => {
  const [sDetailsData, sCreditsData, sProvidersData, sVideosData] = await Promise.all([
    fetch(`movie/${movieId}`),
    fetch(`movie/${movieId}/credits`),
    fetch(`movie/${movieId}/watch/providers`),
    fetch(`movie/${movieId}/videos`),
  ]);

  sMoviesDetails.value.push({ id: movieId, ...sDetailsData });
  sMoviesCredits.value.push({ id: movieId, ...sCreditsData });
  sMoviesProviders.value.push({ id: movieId, ...sProvidersData });
  sMoviesVideos.value.push({ id: movieId, ...sVideosData });
};

const getImdb = (movieId) => getMovieData(sMoviesDetails, movieId, "imdb_id");

const openTrailerDialog = (trailerId) => {
  dialogTrailerId.value = trailerId;

  return trailerDialog.value.openDialog();
};

const sortedMovies = computed(() => {
  const today = new Date();
  return [...sMovies.value]
    .filter((movie) => new Date(movie.release_date) <= today) // Remove filmes com data futura
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); // Ordena do mais recente para o mais antigo
});

const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * commonWords.length);
  let selectedWord = commonWords[randomIndex];

  if (selectedWord.length <= 3) {
    const randomIndex2 = Math.floor(Math.random() * commonWords.length);
    const additionalWord = commonWords[randomIndex2];
    selectedWord += ` ${additionalWord}`;
  }

  return selectedWord;
};

const movieBtnAction = (action, movieTitle, movieId) => {
  const storedMovies = getLocalStorage("watchMovies");

  return (
    (dialogTitle.value = movieTitle),
    (movieTmdbId.value = movieId),
    storedMovies.find((movie) => movie.movieID === movieId) ? (movieWatchDate.value = storedMovies.find((movie) => movie.movieID === movieId).watchDate) : (movieWatchDate.value = ""),
    (dialogAction.value = action),
    action !== "Delete" && AddEditMovieDialog.value.openMvDialog()
  );
};

const showHiddenBtns = (mId, btnLabel) => {
  const hasMovieAgenda = getLocalStorage("watchMovies").filter((mvid) => mvid.movieID === mId)[0];
  const label = btnLabel;

  if ((!hasMovieAgenda && label == "Delete") || (hasMovieAgenda && label == "Add") || (!hasMovieAgenda && label == "Edit")) {
    return "hidden";
  }
};

const delMovieAgenda = (mId, mTitle) => {
  Dialog.create({
    title: "Are you sure",
    message: `Delete <strong>${mTitle.toUpperCase()}</strong> from agenda?`,
    cancel: true,
    persistent: true,
    html: true,
  }).onOk(() => {
    // Removing movie from Agenda
    setLocalStorage(
      "watchMovies",
      getLocalStorage("watchMovies").filter((movie) => movie.movieID !== mId)
    );

    return Notify.create({
      type: "info",
      message: "Movie removed successful",
    });
  });
};

const getDirector = (movieId) => getMovieData(sMoviesCredits, movieId, "crew", (crew) => crew.find((person) => person.job === "Director")?.name || "N/A");

const getRuntime = (movieId) => getMovieData(sMoviesDetails, movieId, "runtime");

const getActors = (movieId) =>
  getMovieData(sMoviesCredits, movieId, "cast", (cast) => {
    const actors = cast.filter((person) => person.known_for_department === "Acting").map((actor) => actor.name);
    return actors.length > 5 ? [...actors.slice(0, 5), "..."] : actors;
  });

const getGenres = (movieId) => getMovieData(sMoviesDetails, movieId, "genres", (genres) => genres.map((genre) => genre.name));

const getTrailer = (movieId) =>
  getMovieData(sMoviesVideos, movieId, "results", (videos) => {
    const trailers = videos.filter((video) => video.type === "Trailer")[0];

    return trailers?.key || "";
  });

onMounted(() => {
  movieWatchDate.value = today();
});
</script>

<style lang="scss" scoped>
.right-\[20px\] {
  right: 20px;
}
.right-\[90px\] {
  right: 90px;
}

:deep(.q-date__header) {
  .q-date__header-subtitle {
    display: none;
  }
}
</style>
