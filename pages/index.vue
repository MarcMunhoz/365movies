<template>
  <v-main class="grey lighten-2">
    <v-container>
      <v-row>
        <Movie />
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import Movie from '@/components/MovieNew.vue'

export default Vue.extend({
  layout: 'default',
  components: {
    Movie,
  },
})
</script>
