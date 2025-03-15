<template>
  <q-dialog class="movie-dialog" v-model="AddEditMovieDialog" persistent>
    <q-card class="min-h-[290px] min-w-[290px] max-w-[400px]" :class="{ 'flex justify-center content-center': movieAddedLoading === true }">
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
          label="Country"
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
          <q-btn color="negative" @click="AddEditMovieDialog = false">Cancel</q-btn>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Notify } from "quasar";
import { availableRegions } from "src/utils/availableRegions";

const props = defineProps({
  movieWatchDate: {
    type: String,
    require: true,
  },
  movieTitle: {
    type: String,
    required: true,
  },
});

const AddEditMovieDialog = ref(false);
const regions = ref([]);
const countrySearch = ref("");
const failedFlags = ref(new Set());
const localmovieWatchDate = ref(props.movieWatchDate);
const movieAddedLoading = ref(false);

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
  return regions.value
    .map(({ iso_3166_1, native_name }) => ({
      code: iso_3166_1,
      name: native_name, // Apenas pegue a string direto, pois não é um objeto
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordena corretamente
});

const markFlagAsFailed = (code) => {
  failedFlags.value.add(code);
};

const movieWatchDateOpt = (movieWatchDateOpt) => {
  return movieWatchDateOpt >= new Date().toISOString().split("T")[0].replace(/-/g, "/");
};

onMounted(async () => {
  regions.value = await availableRegions();
});

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
