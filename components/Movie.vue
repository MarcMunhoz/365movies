<template>
  <v-container>
    <v-row>
      <v-btn @click="getMovies" elevation="2" depressed color="primary" class="mx-auto">Movie of the day</v-btn>
    </v-row>
    <v-row>
      <template v-for="n in 4">
        <v-col :key="n" class="mt-2" cols="12">
          <strong>Category {{ n }}</strong>
        </v-col>

        <v-col v-for="j in 6" :key="`${n}${j}`" cols="6" md="2">
          <v-sheet height="150"></v-sheet>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
const api_key = process.env.OMDBAPI_KEY

export default Vue.extend({
  name: 'Movie',
  data() {
    return {
      movie: Object,
    }
  },
  methods: {
    async getMovies() {
      const rndNumber = Math.floor(Math.random() * (9999999 - 1 + 1)) + 1
      const movieNumber = `tt${String(rndNumber).padStart(7, '0')}`

      const url = `http://www.omdbapi.com/`

      try {
        const resp = await this.$axios.$get(url, {
          params: {
            apikey: api_key,
            type: 'movie',
            i: movieNumber,
          },
        })

        this.movie = resp
        return console.log(this.movie)
      } catch (err) {
        return console.error(err)
      }

      // this.$axios.interceptors.response.use(
      //   (response) => {
      //     console.log(response)

      //     return response
      //   },
      //   (error) => {
      //     return Promise.reject(error)
      //   }
      // )
    },
  },
})
</script>
