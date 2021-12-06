<template>
  <v-app id="inspire">
    <Navigation />

    <nuxt />

    <Footer />
  </v-app>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'

export default {
  data() {
    return {}
  },

  components: {
    Navigation,
    Footer,
  },
}
</script>
