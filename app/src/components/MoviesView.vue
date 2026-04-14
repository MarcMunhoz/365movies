<template>
  <q-page class="w-full px-5 py-4 movies-page">
    <div class="row w-full" v-if="progressLoader === true">
      <q-circular-progress size="2rem" color="primary" class="mx-auto" indeterminate></q-circular-progress>
      <p class="text-center text-lg font-bold text-primary animate-pulse mt-2 w-full">Please, wait...</p>
    </div>

    <section v-else class="flex flex-wrap justify-center gap-5 mt-5">
      <q-card
        v-for="(sMovie, i) in sortedMovies"
        :key="i"
        class="relative w-[374px] max-w-[374px] movie-card"
        :class="{ 'movie-card--agenda': isInAgenda(sMovie.id), 'movie-card--watched': isWatched(sMovie.id) }"
      >
        <img v-if="sMovie.poster_path != null" :src="`https://image.tmdb.org/t/p/w300${sMovie.poster_path}`" class="object-cover h-[250px] w-full movie-poster" />
        <img v-else src="/img/no-image.jpg" class="object-cover h-[250px] w-full movie-poster" />
        <div class="movie-poster-overlay"></div>

        <div class="status-badges">
          <q-badge v-if="isInAgenda(sMovie.id)" color="info" class="agenda-badge">
            In agenda
          </q-badge>
          <q-badge v-if="isWatched(sMovie.id)" color="positive" class="watched-badge">
            Watched
          </q-badge>
        </div>

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

        <q-card-section class="flex justify-around movie-meta">
          <div class="text-h6 w-full">{{ sMovie.title }}</div>
          <div class="text-end w-full">
            <q-chip color="primary" text-color="white" dense class="age-chip">
              Age: {{ getAgeRating(sMovie.id) }}
            </q-chip>
          </div>

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

        <q-card-section class="movie-details">
          <div class="text-subtitle-1 w-100"><strong>Director:</strong> {{ getDirector(sMovie.id) }}</div>

          <div class="text-subtitle-1 w-100"><strong>Actors:</strong> {{ getActors(sMovie.id)?.join(", ") || "N/A" }}</div>

          <div class="text-subtitle-1 w-100"><strong>Genres:</strong> {{ getGenres(sMovie.id)?.join(", ") || "N/A" }}</div>

          <div class="text-subtitle-1 w-100"><strong>Country:</strong> {{ getOriginCountry(sMovie.id) }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none mt-3 min-h-[190px] flex flex-col movie-overview">
          <q-btn v-if="getTrailer(sMovie.id).length" icon="smart_display" color="primary" class="block mb-4 trailer-btn" @click="openTrailerDialog(getTrailer(sMovie.id))">&nbsp;Trailer</q-btn>
          <q-btn v-else outline color="negative" class="block mb-4" disable label="NO TRAILER" />
          <p class="mb-2">{{ getOverviewText(sMovie.id, sMovie.overview) }}</p>
          <q-btn
            v-if="shouldShowOverviewToggle(sMovie.overview)"
            flat
            dense
            no-caps
            color="primary"
            class="self-start"
            :label="isOverviewExpanded(sMovie.id) ? 'Read less' : 'Read more'"
            @click="toggleOverview(sMovie.id)"
          />
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
      :selected-country="selectedCountry"
      :new-movie="newMovie"
    />
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { commonWords } from "utils/commonWords";
import { useTmdb } from "composables/useTmdb";
import { useMovieData } from "composables/useMovieData";
import { getLocalStorage } from "composables/useLocalStorage";
import { movieBtnAction, delMovieAgenda, dialogTitle, movieTmdbId, movieWatchDate, selectedCountry, dialogAction, newMovie, AddEditMovieDialog } from "composables/useMovieActions.js";
import { today } from "utils/dateToday";
import Trailers from "components/Trailers.vue";
import AddEditMovie from "components/AddEditMovie.vue";

const searchTerm = ref("");
const luckyMethod = ref(false);
const noMovie = ref(false);
const progressLoader = ref(false);
const overviewExpanded = ref({});
const OVERVIEW_MAX_LENGTH = 180;
const route = useRoute();

const { fetch } = useTmdb();
const sMoviesCredits = ref([]);
const sMoviesDetails = ref([]);
const sMoviesProviders = ref([]);
const sMoviesVideos = ref([]);
const sMoviesReleaseDates = ref([]);
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
const { getMovieData } = useMovieData(sMoviesCredits, sMoviesDetails, sMoviesProviders, sMoviesVideos);

const sFnmovies = async () => {
  // Resetando estado
  sMovies.value = [];
  sMoviesDetails.value = [];
  sMoviesCredits.value = [];
  sMoviesProviders.value = [];
  sMoviesVideos.value = [];
  sMoviesReleaseDates.value = [];
  overviewExpanded.value = {};
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
  const [sDetailsData, sCreditsData, sProvidersData, sVideosData, sReleaseDatesData] = await Promise.all([
    fetch(`movie/${movieId}`),
    fetch(`movie/${movieId}/credits`),
    fetch(`movie/${movieId}/watch/providers`),
    fetch(`movie/${movieId}/videos`),
    fetch(`movie/${movieId}/release_dates`),
  ]);

  sMoviesDetails.value.push({ id: movieId, ...sDetailsData });
  sMoviesCredits.value.push({ id: movieId, ...sCreditsData });
  sMoviesProviders.value.push({ id: movieId, ...sProvidersData });
  sMoviesVideos.value.push({ id: movieId, ...sVideosData });
  sMoviesReleaseDates.value.push({ id: movieId, ...sReleaseDatesData });
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

const showHiddenBtns = (mId, btnLabel) => {
  const hasMovieAgenda = getLocalStorage("watchMovies").filter((mvid) => mvid.movieID === mId)[0];
  const label = btnLabel;

  if ((!hasMovieAgenda && label == "Delete") || (hasMovieAgenda && label == "Add") || (!hasMovieAgenda && label == "Edit")) {
    return "hidden";
  }
};

const getAgendaMovie = (movieId) => getLocalStorage("watchMovies").find((movie) => movie.movieID === movieId);

const isInAgenda = (movieId) => Boolean(getAgendaMovie(movieId));

const isWatched = (movieId) => Boolean(getAgendaMovie(movieId)?.watched);

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

const getAgeRating = (movieId) => {
  const releaseData = sMoviesReleaseDates.value.find((item) => item.id === movieId);
  const countries = releaseData?.results || [];
  if (!countries.length) return "N/A";

  const originCode = getMovieData(sMoviesDetails, movieId, "production_countries", (countries) => countries?.[0]?.iso_3166_1 || "");

  const preferredCountry =
    countries.find((country) => country.iso_3166_1 === originCode) ||
    countries.find((country) => country.iso_3166_1 === "US") ||
    countries.find((country) => country.release_dates?.some((release) => release.certification));

  if (!preferredCountry?.release_dates?.length) return "N/A";

  const certification = preferredCountry.release_dates.find((release) => release.certification?.trim())?.certification;

  return certification?.trim() || "N/A";
};

const getOriginCountry = (movieId) =>
  getMovieData(sMoviesDetails, movieId, "production_countries", (countries) => {
    if (!countries?.length) return "N/A";
    return countries.map((country) => country.name).join(", ");
  });

const isOverviewExpanded = (movieId) => Boolean(overviewExpanded.value[movieId]);

const shouldShowOverviewToggle = (overview) => Boolean(overview && overview.length > OVERVIEW_MAX_LENGTH);

const getOverviewText = (movieId, overview) => {
  if (!overview) return "N/A";
  if (isOverviewExpanded(movieId) || !shouldShowOverviewToggle(overview)) return overview;
  return `${overview.slice(0, OVERVIEW_MAX_LENGTH).trim()}...`;
};

const toggleOverview = (movieId) => {
  overviewExpanded.value = {
    ...overviewExpanded.value,
    [movieId]: !isOverviewExpanded(movieId),
  };
};

const applyRouteSearch = () => {
  const query = typeof route.query.q === "string" ? route.query.q.trim() : "";
  const lucky = route.query.lucky === "1";

  if (!query && !lucky) {
    sMovies.value = [];
    sMoviesDetails.value = [];
    sMoviesCredits.value = [];
    sMoviesProviders.value = [];
    sMoviesVideos.value = [];
    sMoviesReleaseDates.value = [];
    overviewExpanded.value = {};
    noMovie.value = false;
    progressLoader.value = false;
    return;
  }

  searchTerm.value = query;
  luckyMethod.value = lucky;
  return sFnmovies();
};

onMounted(() => {
  movieWatchDate.value = today();
});

watch(() => [route.query.q, route.query.lucky, route.query.run], applyRouteSearch, { immediate: true });
</script>

<style lang="scss" scoped>
.movies-page {
  max-width: 1320px;
  margin: 0 auto;
}

.movie-card {
  background: linear-gradient(180deg, #132033 0%, #111f30 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.32);
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
  animation: card-enter 360ms ease both;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 196, 86, 0.45);
  }

  &--agenda {
    border-color: rgba(77, 200, 176, 0.7);
    box-shadow: 0 14px 34px rgba(14, 120, 104, 0.35);
  }

  &--watched {
    border-color: rgba(100, 221, 160, 0.9);
    box-shadow: 0 16px 36px rgba(31, 174, 109, 0.4);
  }
}

.movie-poster {
  filter: saturate(1.08) contrast(1.03);
}

.movie-poster-overlay {
  position: absolute;
  inset: 0;
  height: 250px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(6, 11, 20, 0.08) 45%, rgba(6, 11, 20, 0.65) 100%);
}

.status-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .agenda-badge,
  .watched-badge {
    font-weight: 700;
    letter-spacing: 0.02em;
  }
}

.movie-meta {
  color: #f0f6ff;
}

.age-chip {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.movie-details {
  color: #d9e8f6;
}

.movie-overview {
  color: #c2d4e8;
}

.trailer-btn {
  max-width: 130px;
}

.right-\[20px\] {
  right: 20px;
}

.right-\[90px\] {
  right: 90px;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.q-date__header) {
  .q-date__header-subtitle {
    display: none;
  }
}
</style>
