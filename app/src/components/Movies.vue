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
        <img v-else src="../assets/img/no-image.jpg" class="object-cover h-[250px]" />

        <div class="absolute top-[220px] right-[20px] flex gap-x-4">
          <q-fab color="primary" icon="keyboard_arrow_down" direction="down" class="opacity-90">
            <q-fab-action
              v-for="btn in agendaButtons"
              color="accent"
              @click="
                switch (btn.label) {
                  case 'Delete':
                    delMovieAgenda(getImdb(sMovie.id));
                    break;
                  default:
                    movieBtnAction(btn.label, getImdb(sMovie.id), sMovie.title, sMovie.id);
                }
              "
              :icon="btn.icon"
              :label="btn.label"
              :class="showHiddenBtns(getImdb(sMovie.id), btn.label)"
            />
          </q-fab>

          <q-btn
            v-if="getImdb(sMovie.id) !== 'Unknown'"
            icon="assignment"
            color="primary"
            class="white--text opacity-75"
            :href="`https://www.imdb.com/title/${getImdb(sMovie.id)}`"
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
      <img src="../assets/img/not-found.gif" class="mt-3 w-[300px] mx-auto" />
    </div>

    <Trailers ref="trailerDialog" :trailer-id="dialogTrailerId" />
    <AddEditMovie ref="AddEditMovieDialog" :movie-watch-date="movieWatchDate" :movie-title="dialogTitle" :movie-providers="sMoviesProviders.filter((provider) => provider.id === movieTmdbId)" />

    <!-- OLD CODE HERE -->

    <q-dialog class="movie-dialog" v-model="openAgendaDialog" persistent>
      <q-card class="min-h-[290px] min-w-[290px] max-w-[400px]" :class="{ 'flex justify-center content-center': movieAddedLoading === true }">
        <q-card-section v-if="movieAddedLoading === true">
          <q-spinner-pie color="primary" size="8em" />
        </q-card-section>

        <q-card-section v-else class="flex justify-center">
          <q-select
            v-model="countrySearch"
            :options="countriesList"
            autofocus
            @update:model-value="checkCountry"
            :rules="[(val) => !!val || 'Please select a country']"
            label="Country"
            hint="STREAMING IN"
            class="w-full mb-4 select-country"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-img :src="`https://flagsapi.com/${scope.opt.value.toUpperCase()}/shiny/32.png`" loading="lazy" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-date v-model="movieWatchDate" :options="movieWatchDateOpt" subtitle="" :title="dialogTitle" />
        </q-card-section>

        <q-card-actions v-if="movieAddedLoading === false" align="center" class="bg-white text-teal">
          <q-btn color="negative" @click="openAgendaDialog = false">Cancel</q-btn>
          <q-btn
            color="primary"
            @click="
              switch (dialogAction) {
                case 'Add':
                  getStreamingList();
                  break;
                case 'Edit':
                  editMovieAgenda();
              }
            "
            >Okay</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { commonWords } from "src/utils/commonWords";
import { useTmdb } from "src/composables/useTmdb";
import { useMovieData } from "src/composables/useMovieData";
import Trailers from "./Trailers.vue";
import AddEditMovie from "./AddEditMovie.vue";

export default {
  name: "Movies",
  components: { Trailers, AddEditMovie },
  setup() {
    const { fetch } = useTmdb();
    const sMoviesCredits = ref([]);
    const sMoviesDetails = ref([]);
    const sMoviesProviders = ref([]);
    const sMoviesVideos = ref([]);
    const sMovies = ref([]);
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

    // CÓDIGO ANTIGO A PARTIR DAQUI

    const api_key = process.env.OMDBAPI_KEY;
    const streaming_key = process.env.STREAMING_KEY;
    const $q = ref(useQuasar());
    const api_streaming = axios.create({ baseURL: "https://streaming-availability.p.rapidapi.com" });

    // API Data
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
    const countriesList = ref([]);
    const countrySearch = ref("");
    const dialogAction = ref(String);
    const dialogTitle = ref("");
    const luckyMethod = ref(Boolean);
    const movieAddedLoading = ref(false);
    const movieId = ref(String);
    const movieTmdbId = ref(String);
    const movieWatchDate = ref("");
    const moviesDetails = ref(Array);
    const moviesTitles = ref(Array);
    const openAgendaDialog = ref(false);
    const searchRules = ref([(value) => (value && value.length >= 3) || "Min 3 characters"]);
    const searchTerm = ref("");
    const selectedCountry = ref(String);
    const streamingList = ref([]);
    const watchMovies = ref([]);
    const noMovie = ref(false);
    const progressLoader = ref(false);

    // API Functions/Methods
    const today = () => {
      return new Date().toISOString().split("T")[0].replace(/-/g, "/");
    };

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

    const movieBtnAction = (action, imdbId, movieTitle, movieRawId) => {
      return (
        (dialogTitle.value = movieTitle),
        (movieId.value = imdbId),
        (movieTmdbId.value = movieRawId),
        watchMovies.value.find((movie) => movie.movieID === imdbId) ? (movieWatchDate.value = watchMovies.value.find((movie) => movie.movieID === imdbId).watchDate) : (movieWatchDate.value = ""),
        (dialogAction.value = action),
        action !== "Delete" && AddEditMovieDialog.value.openMvDialog()
      );
    };

    const showHiddenBtns = (mId, btnLabel) => {
      const hasMovieAgenda = watchMovies.value.filter((mvid) => mvid.movieID === mId)[0];
      const label = btnLabel;

      if ((!hasMovieAgenda && label == "Delete") || (hasMovieAgenda && label == "Add") || (!hasMovieAgenda && label == "Edit")) {
        return "hidden";
      }
    };

    const getStreamingList = () => {
      if (selectedCountry.value.length < 2) {
        const selectCountry = document.querySelector(".select-country");

        $q.value.notify({
          type: "warning",
          message: "Please, choose a country",
        });

        selectCountry.focus();

        return false;
      } else {
        movieAddedLoading.value = true;

        api_streaming
          .get("/get", {
            headers: {
              "X-RapidAPI-Key": streaming_key,
            },
            params: {
              imdb_id: movieId.value,
              output_language: "en",
            },
          })
          .then((res) => {
            const countryCode = selectedCountry.value;
            const rawData = res.data.result.streamingInfo[countryCode];

            const uniqueData = new Set();

            // Filtering and creating an array with unique service entries
            const uniqueServices = rawData.filter((item) => {
              // Check if the service is not in the Set
              if (!uniqueData.has(item.service)) {
                // Add the service to the Set
                uniqueData.add(item.service);
                return true;
              }
              return false; // Exclude duplicates from the filtered array
            });

            return (streamingList.value = uniqueServices);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            const editMovie = watchMovies.value.find((movie) => movie.movieID == movieId.value);

            if (editMovie === undefined) addMovieAgenda();
            else {
              watchMovies.value.find((movie) => movie.movieID == movieId.value).streamingList = streamingList.value;

              return $q.value.notify({
                type: "info",
                message: "Movie editted successful. Nice!",
              });
            }

            return (movieAddedLoading.value = false);
          });
      }
    };

    const getCountries = () => {
      const ctList = localStorage.moviesContriesList ? JSON.parse(localStorage.moviesContriesList) : null;

      if (ctList) {
        ctList.forEach((e) => {
          const country = {
            value: e.countryCode,
            label: e.name,
          };

          return countriesList.value.push(country);
        });

        return countriesList.value.sort((a, b) => a.label.localeCompare(b.label));
      } else {
        api_streaming
          .get("/countries", {
            headers: {
              "X-RapidAPI-Key": streaming_key,
            },
          })
          .then((res) => {
            return (countriesList.value = Object.values(res.data.result));
          });
      }
    };

    const checkCountry = () => {
      selectedCountry.value = "";

      selectedCountry.value = countrySearch.value.value; // Prop named 'value' coz Quasar qselect options needs it

      return $q.value.notify({
        type: "positive",
        message: `Okay. We'll search by streaming services from ${countrySearch.value.label.toUpperCase()}`,
      });
    };

    const addMovieAgenda = () => {
      // Adds the movie into an Array and closes the calendar dialog
      const newMovieagenda = {
        watchDate: !movieWatchDate.value == "" ? movieWatchDate.value : today(),
        movieID: movieId.value,
        movieTitle: dialogTitle.value,
        streamingList: streamingList.value,
        streamingCountry: selectedCountry.value,
        streamingCountryName: selectedCountry.value !== "us" ? countrySearch.value.label : "United States",
        watched: false,
      };

      watchMovies.value.push(newMovieagenda);

      openAgendaDialog.value = false;

      countrySearch.value = "";

      return $q.value.notify({
        type: "positive",
        message: "Movie added successful. Good fun!",
      });
    };

    const editMovieAgenda = () => {
      watchMovies.value.find((movie) => movie.movieID == movieId.value).watchDate = movieWatchDate.value;
      watchMovies.value.find((movie) => movie.movieID == movieId.value).streamingCountry = selectedCountry.value;
      watchMovies.value.find((movie) => movie.movieID == movieId.value).streamingCountryName = countrySearch.value;
      openAgendaDialog.value = false;

      return getStreamingList();
    };

    const delMovieAgenda = (mId) => {
      const movieToDelete = watchMovies.value.filter((movie) => movie.movieID !== mId);

      watchMovies.value = movieToDelete;

      return $q.value.notify({
        type: "info",
        message: "Movie removed successful.",
      });
    };

    getCountries(); // Gets countrie list from API on created

    onMounted(() => {
      movieWatchDate.value = today();

      if (localStorage.watchMovies && localStorage.watchMovies !== "undefined") {
        return (watchMovies.value = JSON.parse(localStorage.watchMovies));
      }
    });

    return {
      agendaButtons,
      countriesList,
      countrySearch,
      dialogAction,
      dialogTitle,
      luckyMethod,
      movieAddedLoading,
      movieId,
      movieWatchDate,
      moviesDetails,
      moviesTitles,
      openAgendaDialog,
      searchRules,
      searchTerm,
      selectedCountry,
      streamingList,
      noMovie,
      watchMovies,
      checkCountry,
      getStreamingList,
      editMovieAgenda,
      delMovieAgenda,
      movieBtnAction,
      showHiddenBtns,

      progressLoader,
      sFnmovies,
      sMoviesProviders,
      movieTmdbId,
      sortedMovies,
      openTrailerDialog,
      trailerDialog,
      dialogTrailerId,
      AddEditMovieDialog,
      getImdb: (movieId) => getMovieData(sMoviesDetails, movieId, "imdb_id"),

      getDirector: (movieId) => getMovieData(sMoviesCredits, movieId, "crew", (crew) => crew.find((person) => person.job === "Director")?.name || "N/A"),

      getRuntime: (movieId) => getMovieData(sMoviesDetails, movieId, "runtime"),

      getActors: (movieId) =>
        getMovieData(sMoviesCredits, movieId, "cast", (cast) => {
          const actors = cast.filter((person) => person.known_for_department === "Acting").map((actor) => actor.name);
          return actors.length > 5 ? [...actors.slice(0, 5), "..."] : actors;
        }),

      getGenres: (movieId) => getMovieData(sMoviesDetails, movieId, "genres", (genres) => genres.map((genre) => genre.name)),

      getTrailer: (movieId) =>
        getMovieData(sMoviesVideos, movieId, "results", (videos) => {
          const trailers = videos.filter((video) => video.type === "Trailer")[0];

          return trailers?.key || "";
        }),
    };
  },
  watch: {
    watchMovies: {
      // Watches the add movie action and appends the local storage with it
      handler(addMovieAgenda) {
        localStorage.watchMovies = JSON.stringify(addMovieAgenda);
      },
      deep: true,
    },
    countriesList: {
      handler(getCountries) {
        localStorage.moviesContriesList = JSON.stringify(getCountries);
      },
      deep: true,
    },
  },
};
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
