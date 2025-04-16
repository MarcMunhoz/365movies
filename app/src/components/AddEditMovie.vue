<template>
  <q-dialog class="movie-dialog" v-model="AddEditMovieDialog" persistent>
    <q-card class="min-h-[290px] min-w-[290px] max-w-[400px]" :class="{ 'flex justify-center content-center': movieAddedLoading === true }">
      <section v-show="regionsByMovie.length !== 0">
        <q-card-section v-if="movieAddedLoading === true">
          <q-spinner-pie color="primary" size="8em" />
        </q-card-section>

        <q-card-section v-else class="flex justify-center">
          <q-select
            v-model="countrySearch"
            :options="getCountries"
            option-label="name"
            autofocus
            @update:model-value="chosenMesage"
            :rules="[(val) => !!val || 'Please select a country']"
            :label="`Available in ${regionsByMovie.length} countries`"
            hint="STREAMING IN"
            class="w-full mb-4 select-country"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <template v-if="!failedFlags.has(scope.opt.code)">
                    <q-img :src="`https://flagsapi.com/${scope.opt.code}/shiny/32.png`" @error="markFlagAsFailed(scope.opt.code)" loading="lazy" />
                  </template>
                  <q-icon v-else name="public" color="grey" size="32px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-date v-model="localmovieWatchDate" :options="movieWatchDateOpt" :title="movieTitle" />

          <q-card-actions v-if="movieAddedLoading === false" align="center" class="bg-white text-teal mt-5">
            <q-btn color="negative" @click="cancelEdit()">Cancel</q-btn>

            <q-btn
              color="primary"
              @click="
                switch (dialogAction) {
                  case 'Add':
                    addMovie();
                    break;
                  case 'Edit':
                    alert('EDIT');
                }
              "
              >Okay</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </section>

      <section v-if="regionsByMovie.length === 0">
        <h1>XIII... SEM STREAMING</h1>

        <q-card-actions v-if="movieAddedLoading === false" align="center" class="bg-white text-teal mt-5">
          <q-btn color="negative" @click="cancelEdit()">Cancel</q-btn>
        </q-card-actions>
      </section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Notify } from "quasar";
import { availableRegions } from "src/utils/availableRegions";
import { today } from "src/utils/dateToday";
import { getLocalStorage, setLocalStorage } from "src/composables/useLocalStorage";

const props = defineProps({
  dialogAction: {
    type: String,
    required: true,
  },
  movieWatchDate: {
    type: String,
    require: true,
  },
  movieId: {
    type: Number,
    require: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
  movieProviders: {
    type: Array,
    required: true,
  },
});

const AddEditMovieDialog = ref(false);
const regions = ref([]);
const countrySearch = ref("");
const failedFlags = ref(new Set());
const localmovieWatchDate = ref(props.movieWatchDate);
const movieAddedLoading = ref(false);
const regionsByMovie = ref(Array);
const streamingList = ref(Array);
const watchMovies = ref(Array);

const openMvDialog = () => {
  AddEditMovieDialog.value = true;
};

const chosenMesage = () => {
  return Notify.create({
    type: "positive",
    message: `Okay. We'll search by streaming services from ${countrySearch.value.name.toUpperCase()}`,
  });
};

const getCountries = computed(() => {
  const providers = props.movieProviders?.[0]?.results;
  if (!providers) return [];

  const validIsoCodes = new Set(
    Object.entries(providers)
      .filter(([_, data]) => Array.isArray(data.flatrate) && data.flatrate.length > 0)
      .map(([code]) => code)
  );

  // Filter regions that have flatrate streaming
  regionsByMovie.value = regions.value
    .filter(({ iso_3166_1 }) => validIsoCodes.has(iso_3166_1))
    .map(({ iso_3166_1, native_name }) => ({
      code: iso_3166_1,
      name: native_name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return regionsByMovie.value;
});

const markFlagAsFailed = (code) => {
  failedFlags.value.add(code);
};

const movieWatchDateOpt = (movieWatchDateOpt) => {
  return movieWatchDateOpt >= new Date().toISOString().split("T")[0].replace(/-/g, "/");
};

const cancelEdit = () => {
  AddEditMovieDialog.value = false;
  countrySearch.value = "";
};

const addMovie = () => {
  // Get existing movies from localStorage
  const storedMovies = getLocalStorage("watchMovies");

  // Avoid duplicates
  const alreadyExists = storedMovies.some((movie) => movie.movieID === props.movieId);
  if (alreadyExists) {
    console.warn("Movie already added");
    return cancelEdit();
  }

  // Loading state
  movieAddedLoading.value = true;
  streamingList.value = [];

  const countryCode = countrySearch.value.code;
  const streamings = props.movieProviders?.[0]?.results?.[countryCode];

  if (!streamings?.flatrate?.length) {
    movieAddedLoading.value = false;
    return cancelEdit();
  }

  streamingList.value = [...streamings.flatrate];

  const newMovieAgenda = {
    watchDate: localmovieWatchDate.value !== "" ? localmovieWatchDate.value : today(),
    movieID: props.movieId,
    movieTitle: props.movieTitle,
    movieLink: streamings.link,
    streamingList: streamingList.value,
    streamingCountryName: countrySearch.value.name,
    watched: false,
  };

  // Save to localStorage
  localStorage.setItem("watchMovies", JSON.stringify([...storedMovies, newMovieAgenda]));

  const updated = [...storedMovies, newMovieAgenda];
  setLocalStorage("watchMovies", updated);

  movieAddedLoading.value = false;
  return cancelEdit();
};

onMounted(async () => {
  regions.value = await availableRegions();
});

watch(
  watchMovies, // ref ou propriedade do reactive
  (newValue) => {
    localStorage.watchMovies = JSON.stringify(newValue);
  },
  { deep: true }
);

defineExpose({
  openMvDialog,
});
</script>

<style scoped>
:deep(.q-date__header) {
  .q-date__header-subtitle {
    display: none;
  }
}
</style>
