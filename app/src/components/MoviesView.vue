<template>
  <q-page class="mx-auto w-full max-w-[1320px] px-5 py-4">
    <div class="row w-full" v-if="progressLoader === true">
      <q-circular-progress size="2rem" color="primary" class="mx-auto" indeterminate></q-circular-progress>
      <p class="text-center text-lg font-bold text-primary animate-pulse mt-2 w-full">Please, wait...</p>
    </div>

    <section v-else class="mt-5">
      <p v-if="searchFeedbackText" class="mb-4 text-center text-sm text-[#9eb6cb] md:text-base">
        Resultados para <span class="font-semibold text-[#dce9f5]">"{{ searchFeedbackText }}"</span>
      </p>

      <div class="flex flex-wrap justify-center gap-5">



 
      <q-card
        v-for="(sMovie, i) in sortedMovies"
        :key="i"
class="relative w-[374px] max-w-[374px] overflow-hidden border border-white/10 bg-[linear-gradient(180deg,#132033_0%,#111f30_100%)] shadow-[0_12px_28px_rgba(0,0,0,0.32)] transition-all duration-200 ease-in hover:-translate-y-1 hover:border-[rgba(255,196,86,0.45)]" :class="{
        'border-[rgba(77,200,176,0.7)] shadow-[0_14px_34px_rgba(14,120,104,0.35)]': isInAgenda(sMovie.id),
        'border-[rgba(100,221,160,0.9)] shadow-[0_16px_36px_rgba(31,174,109,0.4)]': isWatched(sMovie.id),
      }"
      >
        <img
          v-if="sMovie.poster_path != null"
          :src="`https://image.tmdb.org/t/p/w300${sMovie.poster_path}`"
          :alt="`${sMovie.title} poster`"
          class="h-[250px] w-full cursor-zoom-in object-cover saturate-[1.08] contrast-[1.03]"
          @click="openPosterDialog(sMovie)"
        />
        <img
          v-else
          src="/img/no-image.jpg"
          :alt="`${sMovie.title} poster not available`"
          class="h-[250px] w-full cursor-zoom-in object-cover saturate-[1.08] contrast-[1.03]"
          @click="openPosterDialog(sMovie)"
        />
        <div class="pointer-events-none absolute inset-0 h-[250px] bg-[linear-gradient(180deg,rgba(6,11,20,0.08)_45%,rgba(6,11,20,0.65)_100%)]"></div>
        <q-btn
          flat
          dense
          no-caps
          icon="zoom_out_map"
          class="absolute left-[10px] top-[214px] z-[4] bg-[rgba(5,10,18,0.5)] text-[#dbe8f5]"
          label="View full poster"
          @click="openPosterDialog(sMovie)"
        />

        <div class="absolute left-[10px] top-[10px] z-[3] flex flex-col gap-1.5">
          <q-badge v-if="isInAgenda(sMovie.id)" color="info" class="font-bold tracking-[0.02em]">
            In agenda
          </q-badge>
          <q-badge v-if="isWatched(sMovie.id)" color="positive" class="font-bold tracking-[0.02em]">
            Watched
          </q-badge>
        </div>
          <div class="absolute right-[12px] top-[250px] z-[6] -translate-y-1/2 flex items-center gap-x-1.5">
            <q-fab color="primary" icon="keyboard_arrow_up" direction="up" class="opacity-90 scale-[0.8]">










 
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
class="opacity-80 text-white scale-[0.8]"
            :href="`https://www.imdb.com/title/${sMovie.imdbId}`"
            target="movie"
            title="Go to IMDb"
            fab
size="12px"
          />
        </div>

          <q-card-section class="text-[#f0f6ff] pt-7">
            <div class="mb-3 w-full text-[1.25rem] leading-tight">{{ sMovie.title }}</div>
            <div class="flex items-center gap-3">
              <div class="flex min-w-0 w-full justify-between items-center gap-3">
                <div v-if="sMovie.vote_average != null" class="flex items-center gap-2">
                  <span class="inline-block">
                    <q-rating :model-value="Number(sMovie.vote_average)" color="amber" icon-half="star_half" readonly max="10" size="1.35em" class="w-50" />
                    <q-tooltip class="bg-primary" anchor="bottom middle" self="center middle">
                      {{ sMovie.vote_average }}
                    </q-tooltip>
                  </span>
                </div>

                <q-chip color="primary" text-color="white" dense class="border border-white/20">
                  {{ getAgeRating(sMovie.id) }}
                </q-chip>
                <q-btn flat dense round icon="share" color="blue-grey-3" size="sm" class="opacity-85">
                  <q-menu anchor="bottom right" self="top right" class="min-w-[210px] bg-[rgba(13,25,40,0.96)] text-[#dbe8f5]">
                    <q-list dense padding>
                      <q-item v-if="canNativeShare" clickable v-close-popup @click="shareWithNative(sMovie)">
                        <q-item-section avatar>
                          <q-icon name="ios_share" />
                        </q-item-section>
                        <q-item-section>Share...</q-item-section>
                      </q-item>



                      <q-item clickable v-close-popup @click="openSharePlatform('x', sMovie)">
                        <q-item-section avatar>
                          <q-icon name="mdi-twitter" />
                        </q-item-section>
                        <q-item-section>X</q-item-section>
                      </q-item>



                      <q-item clickable v-close-popup @click="openSharePlatform('facebook', sMovie)">
                        <q-item-section avatar>
                          <q-icon name="mdi-facebook" />
                        </q-item-section>
                        <q-item-section>Facebook</q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup @click="openSharePlatform('whatsapp', sMovie)">
                        <q-item-section avatar>
                          <q-icon name="mdi-whatsapp" />
                        </q-item-section>
                        <q-item-section>WhatsApp</q-item-section>
                      </q-item>

                      <q-separator dark class="my-1" />

                      <q-item clickable v-close-popup @click="copySharePayload(sMovie, true)">
                        <q-item-section avatar>
                          <q-icon name="mdi-instagram" />
                        </q-item-section>
                        <q-item-section>Instagram Direct (copy)</q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup @click="copySharePayload(sMovie)">
                        <q-item-section avatar>
                          <q-icon name="content_copy" />
                        </q-item-section>
                        <q-item-section>Copy link</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
              <div class="flex shrink-0 items-center gap-3">
                <div class="grey--text text-[1.05rem]">
                  {{ sMovie.release_date.split("-")[0] }}
                </div>
                <div v-if="getRuntime(sMovie.id) > 0" class="grey--text text-[1.05rem]">{{ getRuntime(sMovie.id) }}min</div>
              </div>
            </div>


 
        </q-card-section>

        <q-separator />

        <q-card-section class="text-[#d9e8f6]">
          <div class="text-subtitle-1 w-100"><strong>Director:</strong> {{ getDirector(sMovie.id) }}</div>

          <div class="text-subtitle-1 w-100"><strong>Actors:</strong> {{ getActors(sMovie.id)?.join(", ") || "N/A" }}</div>

          <div class="text-subtitle-1 w-100"><strong>Genres:</strong> {{ getGenres(sMovie.id)?.join(", ") || "N/A" }}</div>

          <div class="text-subtitle-1 w-100"><strong>Country:</strong> {{ getOriginCountry(sMovie.id) }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-none mt-3 flex min-h-[190px] flex-col text-[#c2d4e8]">
          <q-btn v-if="getTrailer(sMovie.id).length" icon="smart_display" color="primary" class="mb-4 block max-w-[130px]" @click="openTrailerDialog(getTrailer(sMovie.id))">&nbsp;Trailer</q-btn>
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
      </div>
    </section>

    <div v-if="noMovie === true" class="text-center">
      <img src="/img/not-found.gif" class="mt-3 w-[300px] mx-auto" />
    </div>

    <q-dialog v-model="posterDialog" maximized transition-show="fade" transition-hide="fade">
      <q-card class="flex h-screen w-full flex-col bg-[rgba(6,11,19,0.96)]">
        <q-card-section class="flex items-center justify-between border-b border-white/10 py-2">
          <div class="truncate pr-2 text-sm font-semibold text-[#c9dbeb]">{{ dialogPosterTitle }}</div>
          <q-btn flat round dense icon="close" color="grey-3" v-close-popup />
        </q-card-section>
        <q-card-section class="flex-1 p-0">
          <q-img :src="dialogPosterSrc" fit="contain" class="h-full w-full" />
        </q-card-section>
      </q-card>
    </q-dialog>

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
import { Notify } from "quasar";
import { useRoute } from "vue-router";
import { commonWords } from "utils/commonWords";
import { useTmdb } from "composables/useTmdb";
import { useMovieData } from "composables/useMovieData";
import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";
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
const LAST_SEARCH_KEY = "lastMovieSearch";
const LAST_SEARCH_SNAPSHOT_KEY = "lastMovieSearchSnapshot";
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
const posterDialog = ref(false);
const dialogPosterSrc = ref("");
const dialogPosterTitle = ref("");
const canNativeShare = ref(false);
const { getMovieData } = useMovieData(sMoviesCredits, sMoviesDetails, sMoviesProviders, sMoviesVideos);

const resetMovieState = () => {
  sMovies.value = [];
  sMoviesDetails.value = [];
  sMoviesCredits.value = [];
  sMoviesProviders.value = [];
  sMoviesVideos.value = [];
  sMoviesReleaseDates.value = [];
  overviewExpanded.value = {};
  noMovie.value = false;
  progressLoader.value = false;
};

const saveSearchSnapshot = () => {
  setLocalStorage(LAST_SEARCH_SNAPSHOT_KEY, {
    query: searchTerm.value,
    movies: sMovies.value,
    details: sMoviesDetails.value,
    credits: sMoviesCredits.value,
    providers: sMoviesProviders.value,
    videos: sMoviesVideos.value,
    releaseDates: sMoviesReleaseDates.value,
    noMovie: noMovie.value,
    savedAt: Date.now(),
  });
};

const restoreSearchSnapshot = (query) => {
  const snapshot = getLocalStorage(LAST_SEARCH_SNAPSHOT_KEY, null);
  if (!snapshot || snapshot.query !== query) return false;

  sMovies.value = Array.isArray(snapshot.movies) ? snapshot.movies : [];
  sMoviesDetails.value = Array.isArray(snapshot.details) ? snapshot.details : [];
  sMoviesCredits.value = Array.isArray(snapshot.credits) ? snapshot.credits : [];
  sMoviesProviders.value = Array.isArray(snapshot.providers) ? snapshot.providers : [];
  sMoviesVideos.value = Array.isArray(snapshot.videos) ? snapshot.videos : [];
  sMoviesReleaseDates.value = Array.isArray(snapshot.releaseDates) ? snapshot.releaseDates : [];
  noMovie.value = Boolean(snapshot.noMovie);
  overviewExpanded.value = {};
  progressLoader.value = false;
  return true;
};

const sFnmovies = async () => {
  // Resetando estado
  resetMovieState();
  progressLoader.value = true;

  // Breaks if search field wrong
  if ((!searchTerm.value && !luckyMethod.value) || (searchTerm.value.length < 3 && !luckyMethod.value)) {
    return false;
  }

  luckyMethod.value && (searchTerm.value = getRandomWord());
  setLocalStorage(LAST_SEARCH_KEY, {
    query: searchTerm.value,
    lucky: false,
  });

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

  saveSearchSnapshot();
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

const openPosterDialog = (movie) => {
  dialogPosterTitle.value = `${movie.title} (${movie.release_date?.split("-")[0] || "N/A"})`;
  dialogPosterSrc.value = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "/img/no-image.jpg";
  posterDialog.value = true;
};

const getShareMovieUrl = (movie) => {
  if (movie.imdbId && movie.imdbId !== "Unknown") {
    return `https://www.imdb.com/title/${movie.imdbId}`;
  }
  return `https://www.themoviedb.org/movie/${movie.id}`;
};

const getShareMovieText = (movie) => {
  const year = movie.release_date?.split("-")[0] || "N/A";
  return `Watch this movie: ${movie.title} (${year})`;
};

const openSharePlatform = (platform, movie) => {
  const shareUrl = getShareMovieUrl(movie);
  const shareText = getShareMovieText(movie);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const links = {
    x: `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
  };

  const targetUrl = links[platform];
  targetUrl && window.open(targetUrl, "_blank", "noopener,noreferrer");
};

const copySharePayload = async (movie, toInstagram = false) => {
  const payload = `${getShareMovieText(movie)}\n${getShareMovieUrl(movie)}`;

  try {
    await navigator.clipboard.writeText(payload);
    Notify.create({
      type: "positive",
      message: toInstagram ? "Copied. Paste it in Instagram Direct." : "Movie link copied.",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Could not copy the share text.",
    });
  }
};

const shareWithNative = async (movie) => {
  if (!canNativeShare.value) return;

  try {
    await navigator.share({
      title: movie.title,
      text: getShareMovieText(movie),
      url: getShareMovieUrl(movie),
    });
  } catch (_error) {
    // User cancel is expected in share flow.
  }
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

const searchFeedbackText = computed(() => {
  return typeof searchTerm.value === "string" ? searchTerm.value.trim() : "";
});

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
    const lastSearch = getLocalStorage(LAST_SEARCH_KEY, null);
    const restoredQuery = typeof lastSearch?.query === "string" ? lastSearch.query.trim() : "";
    if (restoredQuery.length >= 3) {
      if (restoreSearchSnapshot(restoredQuery)) {
        searchTerm.value = restoredQuery;
        luckyMethod.value = false;
        return;
      }
      searchTerm.value = restoredQuery;
      luckyMethod.value = false;
      return sFnmovies();
    }

    resetMovieState();
    return;
  }

  searchTerm.value = query;
  luckyMethod.value = lucky;
  return sFnmovies();
};

onMounted(() => {
  canNativeShare.value = typeof navigator !== "undefined" && typeof navigator.share === "function";
  movieWatchDate.value = today();
});

watch(() => [route.query.q, route.query.lucky, route.query.run], applyRouteSearch, { immediate: true });
</script>
