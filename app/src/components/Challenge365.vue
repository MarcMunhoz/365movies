<template>
  <section class="w-full rounded-xl bg-slate-900 text-slate-100">
    <q-expansion-item
      default-opened
      expand-separator
      hide-expand-icon
      header-class="min-h-[88px] px-4 py-3"
    >
      <template #header="{ expanded }">
        <q-item-section avatar class="min-w-0 pr-3">
          <q-icon name="local_movies" color="primary" size="28px" />
        </q-item-section>

        <q-item-section>
          <q-item-label
            class="font-['Sora'] text-xl font-bold leading-tight text-slate-100"
          >
            365 Movie Challenge
          </q-item-label>
          <q-item-label
            caption
            class="mt-1 text-sm leading-relaxed text-slate-400"
          >
            {{ challengeDescription }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon
            :name="expanded ? 'expand_less' : 'expand_more'"
            class="text-slate-400"
            size="24px"
          />
        </q-item-section>
      </template>

      <div class="px-4 pb-4 pt-5">
        <div class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div
            v-for="metric in metrics"
            :key="metric.label"
            class="rounded-lg bg-slate-800 p-4"
          >
            <span class="block text-xs font-medium uppercase text-slate-400">
              {{ metric.label }}
            </span>
            <strong class="mt-1 block text-xl font-semibold">
              {{ metric.value }}
            </strong>
          </div>
        </div>

        <div class="overflow-x-auto pb-2">
          <div class="flex min-w-max justify-center">
            <div
              class="grid w-max grid-flow-col grid-rows-7 gap-1 md:gap-[5px]"
              role="grid"
              :aria-label="`Movie progress in ${currentYear}`"
            >
              <div
                v-for="cell in gridCells"
                :key="cell.key"
                class="h-4 w-4 md:h-[18px] md:w-[18px]"
                role="gridcell"
              >
                <div
                  v-if="cell.day"
                  class="h-full w-full rounded-sm transition-opacity"
                  :class="getDayClasses(cell.day)"
                  :aria-label="getDayAriaLabel(cell.day)"
                >
                  <q-tooltip
                    v-if="cell.day.count > 0"
                    anchor="top middle"
                    self="bottom middle"
                    class="max-w-xs"
                  >
                    <div class="font-medium">
                      {{ formatDisplayDate(cell.day.date) }}
                    </div>
                    <div
                      v-for="movie in cell.day.movies"
                      :key="movie.id"
                      class="mt-1"
                    >
                      {{ movie.title }}
                    </div>
                  </q-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-slate-400"
          aria-label="Grid color legend"
        >
          <span>Less</span>
          <span class="h-4 w-4 rounded-sm bg-slate-700"></span>
          <span class="h-4 w-4 rounded-sm bg-primary opacity-60"></span>
          <span class="h-4 w-4 rounded-sm bg-primary"></span>
          <span>More</span>
          <span
            class="ml-2 h-4 w-4 rounded-sm bg-slate-800 opacity-30"
          ></span>
          <span>Future day</span>
        </div>
      </div>
    </q-expansion-item>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface MovieLog {
  id: string;
  title: string;
  watchedAt: string;
}

interface GridDay {
  date: string;
  isFuture: boolean;
  movies: MovieLog[];
  count: number;
}

interface GridCell {
  key: string;
  day: GridDay | null;
}

interface Metric {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    movieLogs: MovieLog[];
  }>(),
  {
    movieLogs: () => [],
  },
);

const today = startOfDay(new Date());
const currentYear = today.getFullYear();
const challengeGoal = 365;
const gridCellCount = 53 * 7;
const challengeDescription = `Each square represents one day of ${currentYear}. Expand to view your progress and viewing streaks.`;

const movieLogsByDate = computed<Map<string, MovieLog[]>>(() => {
  const groupedLogs = new Map<string, MovieLog[]>();

  for (const movie of props.movieLogs) {
    const movies = groupedLogs.get(movie.watchedAt);

    if (movies) {
      movies.push(movie);
    } else {
      groupedLogs.set(movie.watchedAt, [movie]);
    }
  }

  return groupedLogs;
});

const yearDays = computed<GridDay[]>(() => {
  const firstDay = new Date(currentYear, 0, 1);
  const lastDay = new Date(currentYear, 11, 31);
  const days: GridDay[] = [];

  for (let date = firstDay; date <= lastDay; date = addDays(date, 1)) {
    const formattedDate = formatPtBrDate(date);
    const isFuture = date > today;
    const movies = isFuture
      ? []
      : (movieLogsByDate.value.get(formattedDate) ?? []);

    days.push({
      date: formattedDate,
      isFuture,
      movies,
      count: movies.length,
    });
  }

  return days;
});

const gridCells = computed<GridCell[]>(() => {
  const leadingEmptyCells = new Date(currentYear, 0, 1).getDay();
  const cells: GridCell[] = Array.from(
    { length: leadingEmptyCells },
    (_, index) => ({
      key: `empty-start-${index}`,
      day: null,
    }),
  );

  for (const day of yearDays.value) {
    cells.push({
      key: day.date,
      day,
    });
  }

  while (cells.length < gridCellCount) {
    cells.push({
      key: `empty-end-${cells.length}`,
      day: null,
    });
  }

  return cells;
});

const watchedMoviesTotal = computed<number>(() =>
  yearDays.value.reduce((total, day) => total + day.count, 0),
);

const progressPercentage = computed<number>(() =>
  Math.min(100, (watchedMoviesTotal.value / challengeGoal) * 100),
);

const currentStreak = computed<number>(() => {
  const todayIndex = yearDays.value.findIndex(
    (day) => day.date === formatPtBrDate(today),
  );

  if (todayIndex < 0) {
    return 0;
  }

  let dayIndex =
    yearDays.value[todayIndex].count > 0 ? todayIndex : todayIndex - 1;
  let streak = 0;

  while (dayIndex >= 0 && yearDays.value[dayIndex].count > 0) {
    streak += 1;
    dayIndex -= 1;
  }

  return streak;
});

const longestStreak = computed<number>(() => {
  let longest = 0;
  let current = 0;

  for (const day of yearDays.value) {
    if (day.isFuture) {
      break;
    }

    if (day.count > 0) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
});

const metrics = computed<Metric[]>(() => [
  {
    label: "Total",
    value: `${watchedMoviesTotal.value} / ${challengeGoal}`,
  },
  {
    label: "Percentage",
    value: `${progressPercentage.value.toFixed(1)}%`,
  },
  {
    label: "Current streak",
    value: formatDayCount(currentStreak.value),
  },
  {
    label: "Longest streak",
    value: formatDayCount(longestStreak.value),
  },
]);

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function formatPtBrDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}-${month}-${date.getFullYear()}`;
}

function parsePtBrDate(date: string): Date {
  const [day, month, year] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function formatDisplayDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(parsePtBrDate(date));
}

function formatDayCount(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

function getDayClasses(day: GridDay): string[] {
  if (day.isFuture) {
    return ["cursor-not-allowed", "bg-slate-800", "opacity-30"];
  }

  if (day.count >= 2) {
    return ["cursor-default", "bg-primary"];
  }

  if (day.count === 1) {
    return ["cursor-default", "bg-primary", "opacity-60"];
  }

  return ["bg-slate-700"];
}

function getDayAriaLabel(day: GridDay): string {
  const date = formatDisplayDate(day.date);

  if (day.isFuture) {
    return `${date}: future day`;
  }

  if (day.count === 0) {
    return `${date}: no movies watched`;
  }

  const titles = day.movies.map((movie) => movie.title).join(", ");

  return `${date}: ${day.count} ${day.count === 1 ? "movie" : "movies"} watched: ${titles}`;
}
</script>
