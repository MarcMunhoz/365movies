<template>
  <q-page class="flex flex-center content-center justify-center p-3">
    <q-btn @click="clearCalendar" color="accent" push class="my-4">Clear calendar!</q-btn>
    <Calendar expanded borderless is-double-paned :columns="columns" :rows="5" :attributes="events" :min-date="minDate" :max-date="maxDate">
      <template #day-popover="{ attributes }">
        <ul>
          <li v-for="{ key, popover, customData } in attributes" :key="key" class="block text-primary">
            <a :href="`https://www.imdb.com/title/${customData.movieId}`" target="movie">{{ popover.label }}</a>
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
            },
          };

          eventAdd.popover.label = e.movieTitle;
          eventAdd.customData.movieId = e.movieID;
          eventAdd.dates.push(e.watchDate);

          this.events.push(eventAdd);
        });
      }
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
