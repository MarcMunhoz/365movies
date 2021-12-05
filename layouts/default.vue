<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>365 Movies</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <!--  -->
    </v-navigation-drawer>

    <nuxt />

    <Footer />
  </v-app>
</template>

<script>
import Footer from '@/components/Footer.vue'

export default {
  data: () => ({ drawer: null }),

  components: {
    Footer,
  },
}
</script>
