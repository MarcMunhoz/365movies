<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col v-for="month in months" :key="month" :cols="getColSize()" :sm="getColSize()" :md="getColSize()" :lg="getColSize()" :xl="getColSize()" class="mb-10">
          <h2>{{ new Date(`${month}T00:00:00`).toLocaleString("en-US", { month: "long" }) }}</h2>
          <v-calendar :value="month" color="primary" type="month" :events="events"></v-calendar>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="js">
import Vue from "vue";

export default Vue.extend({
  layout: "default",
  data() {
    return {
      title: "Month Movies",
      events: [
        // You can provide events to be displayed on the calendar
        // Example:
        // { start: '2023-01-10', end: '2023-01-15', summary: 'Event 1' },
        // { start: '2023-02-05', end: '2023-02-10', summary: 'Event 2' },
        // ...
      ],
      months: Array,
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
  created() {
    const currentDate = new Date();  // Get the current date
    const currentYear = currentDate.getFullYear();  // Get the current year
    this.months = []

    for (let month = 0; month < 12; month++) {
      const formattedMonth = `${currentYear}-${(month + 1).toString().padStart(2, '0')}-01`;
      this.months.push(formattedMonth);
    }
  },
  methods: {
    getColSize() {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return 4;
      } else {
        return 12;
      }
    },
  },
});
</script>
