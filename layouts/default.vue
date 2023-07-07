<template>
  <v-app id="inspire">
    <Navigation />

    <nuxt />

    <Footer />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";

export default Vue.extend({
  components: {
    Navigation,
    Footer,
  },
});
</script>
