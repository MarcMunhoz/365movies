<template>
  <q-dialog v-model="AddEditMovieDialog" persistent>
    <q-card
      class="min-h-[290px] min-w-[290px] max-w-[400px] border border-white/15 bg-[linear-gradient(180deg,#15263a_0%,#111f30_100%)] text-[#e4edf6]"
      :class="{ 'flex justify-center content-center': movieAddedLoading === true }"
    >
      <section v-show="regionsByMovie.length !== 0">
        <q-card-section v-if="movieAddedLoading === true">
          <q-spinner-pie color="primary" size="8em" />
        </q-card-section>

        <q-card-section v-else class="flex justify-center text-[#d9e6f3]">
          <q-select
            v-model="countrySearch"
            :options="getCountries"
            option-label="name"
            autofocus
            @update:model-value="chosenMesage"
            :rules="[(val) => !!val || 'Please select a country']"
            :label="`Available in ${regionsByMovie.length} countries`"
            hint="STREAMING IN"
            id="field_select-country"
            class="mb-4 w-full [&_.q-field__control]:border [&_.q-field__control]:border-white/15 [&_.q-field__control]:bg-white/5 [&_.q-field__control]:text-[#e8f0f8] [&_.q-field__label]:!text-[#cbdcec] [&_.q-field__marginal]:!text-[#cbdcec] [&_.q-field__native]:!text-[#cbdcec] [&_.q-field__input]:!text-[#cbdcec] [&_.q-field__hint]:!text-[#cbdcec] [&_.q-field__bottom]:!text-[#cbdcec] [&_.q-field__messages]:!text-[#cbdcec]"
            popup-content-class="border border-white/15 bg-[#13263a] text-[#e5eff8] shadow-[0_14px_26px_rgba(0,0,0,0.36)] [&_.q-item]:mx-[6px] [&_.q-item]:my-[2px] [&_.q-item]:rounded-lg [&_.q-item]:text-[#d7e7f6] [&_.q-item:hover]:bg-[#4dc8b02e] [&_.q-item.q-manual-focusable--focused]:bg-[#4dc8b042] [&_.q-item.q-item--active]:bg-[#4dc8b042] [&_.q-item.q-manual-focusable--focused]:text-[#f2fffb] [&_.q-item.q-item--active]:text-[#f2fffb] [&_.q-item__label]:text-[#e6f2ff]"
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

          <q-date
            v-model="localmovieWatchDate"
            :options="movieWatchDateOpt"
            :title="movieTitle"
            class="border border-white/15 bg-[rgba(17,31,48,0.95)] text-[#e7f0f8] [&_.q-date__header]:bg-[#4dc8b024] [&_.q-date__calendar-item]:text-[#dce8f5] [&_.q-date__view_.q-btn]:text-[#dce8f5]"
          />

          <q-card-actions v-if="movieAddedLoading === false" align="center" class="mt-5 border-t border-white/10 bg-[rgba(8,15,24,0.72)]">
            <q-btn color="negative" @click="clearDialog()">Cancel</q-btn>

            <q-btn
              color="primary"
              @click="
                switch (dialogAction) {
                  case 'Add':
                    addMovie();
                    break;
                  case 'Edit':
                    editMovie();
                }
              "
              >{{ dialogAction }} Movie</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </section>

      <section v-if="regionsByMovie.length === 0">
        <h1 class="mt-6 text-center text-[1.2rem] text-[#e5f2ff]">No streaming available</h1>

        <q-card-actions v-if="movieAddedLoading === false" align="center" class="mt-5 border-t border-white/10 bg-[rgba(8,15,24,0.72)]">
          <q-btn color="negative" @click="clearDialog()">Cancel</q-btn>
        </q-card-actions>
      </section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Notify } from "quasar";
import { availableRegions } from "utils/availableRegions";
import { today } from "utils/dateToday";
import { getLocalStorage, setLocalStorage } from "composables/useLocalStorage";

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
  selectedCountry: {
    type: String,
    required: false,
  },
  newMovie: {
    type: Boolean,
    required: false,
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

const clearDialog = () => {
  AddEditMovieDialog.value = false;

  props.newMovie && ((countrySearch.value = ""), (localmovieWatchDate.value = ""));
};

const addMovie = () => {
  // Get existing movies from localStorage
  const storedMovies = getLocalStorage("watchMovies");

  // Loading state
  movieAddedLoading.value = true;
  streamingList.value = [];

  const countryCode = countrySearch.value.code;
  const streamings = props.movieProviders?.[0]?.results?.[countryCode];

  if (!streamings?.flatrate?.length) {
    movieAddedLoading.value = false;
    return clearDialog();
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
  const updated = [...storedMovies, newMovieAgenda];
  setLocalStorage("watchMovies", updated);

  movieAddedLoading.value = false;

  Notify.create({
    type: "positive",
    message: "Movie added successful. Good fun!",
  });
  return clearDialog();
};

const editMovie = () => {
  // Get existing movies from localStorage
  const storedMovies = getLocalStorage("watchMovies");

  const streamings = props.movieProviders?.[0]?.results?.[countrySearch.value.code];

  const updatedMovies = storedMovies.map((movie) => {
    if (movie.movieID === props.movieId) {
      return {
        ...movie,
        watchDate: localmovieWatchDate.value,
        streamingCountryName: countrySearch.value,
        streamingList: [...streamings.flatrate],
        movieLink: streamings.link,
      };
    }
    return movie;
  });

  setLocalStorage("watchMovies", updatedMovies);

  return clearDialog();
};

onMounted(async () => {
  regions.value = await availableRegions();
});

watch(
  () => [props.selectedCountry, props.movieWatchDate],
  ([newCountry, newWatchDate]) => {
    if (newCountry) {
      if (typeof newCountry === "string") {
        // Quando é uma string ("Brazil"), busca o objeto correspondente
        const matched = getCountries.value.find((country) => country.name === newCountry);
        if (matched) {
          countrySearch.value = matched;
        }
      } else if (typeof newCountry === "object") {
        // Quando já é um objeto { code, name }
        countrySearch.value = newCountry;
      }
    }

    if (newWatchDate) {
      localmovieWatchDate.value = newWatchDate;
    }
  },
  { immediate: true }
);

defineExpose({
  openMvDialog,
});
</script>

<style lang="scss" scoped>
:deep(.q-date__header-subtitle) {
  display: none;
}
</style>
