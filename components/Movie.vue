<template>
  <v-container>
    <v-row>
      <v-btn @click="getMovies" elevation="2" depressed color="primary" class="mx-auto">Movie of the day</v-btn>
    </v-row>
    <v-row>
      <ol>
        <li v-for="(movie, i) in movies" :key="i">{{ movie.Title }} - Array len {{ movies.length }}</li>
      </ol>
    </v-row>
  </v-container>
</template>

<script>
const api_key = process.env.OMDBAPI_KEY

export default {
  name: 'Movie',
  data() {
    return {
      movies: [],
      counter: 0,
    }
  },
  methods: {
    getMovies() {
      this.counter = 0
      this.movies = []
      const url = `https://www.omdbapi.com/`

      while (this.counter < 10) {
        let rndNumber = Math.floor(Math.random() * (9999999 - 1 + 1)) + 1
        let movieNumber = `tt${String(rndNumber).padStart(7, '0')}`

        try {
          this.$axios
            .$get(url, {
              params: {
                apikey: api_key,
                i: movieNumber,
              },
            })
            .then((resp) => {
              if (resp.Response === 'True') {
                return resp.Type === 'movie' && this.movies.push(resp)
              } else {
                throw new Error(resp.Error)
              }
            })
            .catch((err) => {
              return console.log(err)
            })
        } catch (error) {
          return console.log(error)
        }

        this.movies.length < 10 && this.counter++
      }
    },
  },
}
</script>
