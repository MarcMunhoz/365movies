<template>
  <q-page data-cy="challenge-page" class="mx-auto w-full max-w-[1320px] px-3 pb-6 pt-4 md:px-5">
    <section class="mb-4 flex flex-col gap-2 rounded-xl border border-white/10 bg-[rgba(10,18,30,0.62)] p-3">
      <h1 class="font-['Sora'] text-2xl font-bold text-[#e8f0f8] md:text-[1.75rem]">365 Movie Challenge</h1>
      <p class="text-sm text-[#9db4c8]">Track your yearly movie progress, streaks, and watched-day grid.</p>
    </section>

    <Challenge365 data-cy="challenge-365" :movie-logs="challengeMovieLogs" />
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import Challenge365 from "components/Challenge365.vue";
import { getLocalStorage } from "composables/useLocalStorage";
import { formatChallengeDate } from "utils/agendaDates";

const watchMovies = ref(getLocalStorage("watchMovies"));

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
</script>
