<template>
  <v-main class="grey lighten-2">
    <!-- {{ getMovies() }} -->
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
      <v-row>
        {{ movie.Title }}
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
const api_key = process.env.OMDBAPI_KEY

export default {
  layout: 'default',
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
            i: movieNumber,
          },
        })
        console.log(resp)
      } catch (err) {
        return console.error(err)
      }
    },
  },
}
</script>
