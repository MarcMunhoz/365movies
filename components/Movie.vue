<template>
  <v-container>
    <v-row>
      <v-btn @click="getMovies" elevation="2" depressed color="primary" class="mx-auto">Movie of the day</v-btn>
    </v-row>
    <!-- <v-row>
      <ul>
        <li v-for="movie in movies" :key="movie">
          {{ movie.Title }}
        </li>
      </ul>
    </v-row> -->
  </v-container>
</template>

<script>
const api_key = process.env.OMDBAPI_KEY

export default {
  name: 'Movie',
  data() {
    return {
      movies: [],
      movieCnt: 0,
    }
  },
  methods: {
    getMovies() {
      const url = `https://www.omdbapi.com/`
      let counter = 1

      while (this.movieCnt < 11) {
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
                return resp.Type === 'movie' && this.movies.push(resp), this.movieCnt++
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
      }

      console.log(this.movies)
      console.log(this.movieCnt)
    },
  },
}
</script>
