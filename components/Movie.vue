<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="searchTerm"
        label="Type anything and press ENTER"
        :rules="searchRules"
        hide-details="auto"
        @keyup.enter=";(luckyMethod = false), search()"
      ></v-text-field>
    </v-row>
    <v-row>
      <p class="h1 text-center my-4">OR</p>
    </v-row>
    <v-row>
      <v-btn depressed small color="primary" class="mx-auto mb-5 w-25" @click=";(luckyMethod = true), search()">I'm lucky!</v-btn>
    </v-row>
    <v-card v-if="movie.title" elevation="2" class="mt-4 mx-auto p-0" max-width="374">
      <v-img height="250" :src="movie.image"></v-img>

      <v-card-title style="position: relative">
        {{ movie.title }}

        <v-btn absolute color="primary" class="white--text" :href="`https://www.imdb.com/title/${movie.id}`" target="movie" fab small right top>
          <v-icon>mdi-clipboard-text-outline</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="movieInfo.imDbRating">
        <v-row align="center" class="mx-0 d-flex flex-wrap">
          <v-rating :value="Number(movieInfo.imDbRating)" color="amber" dense half-increments readonly length="10" size="14" class="w-50"></v-rating>

          <div class="grey--text p-0 ms-4 w-auto">
            {{ movieInfo.imDbRating }}
          </div>

          <div class="grey--text p-0 ms-4 w-auto">
            {{ movieInfo.year }}
          </div>

          <div class="grey--text pl-0 ms-4 w-auto">
            {{ movieInfo.runtimeStr }}
          </div>
        </v-row>

        <div class="my-4 text-subtitle-1">
          {{ movieInfo.plot }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
const api_key = process.env.IMDBAPI_KEY

export default {
  name: 'Movie',
  data() {
    return {
      alphabet: [...'abcdefghijklmnopqrstuvwxyz'],
      luckyMethod: Boolean,
      searchTerm: '',
      searchRules: [(value) => (value && value.length >= 3) || 'Min 3 characters'],
      movie: Object,
      movieInfo: Object,
      uri: 'https://imdb-api.com/en/API',
      endpoint: String,
    }
  },
  methods: {
    search() {
      // Setting defaults
      this.movie = {}
      this.movieInfo = {}

      // Breaks if search field wrong
      if ((!this.searchTerm && !this.luckyMethod) || (this.searchTerm.length < 3 && !this.luckyMethod)) {
        return false
      }

      if (this.luckyMethod) {
        // Sets defaults for random search
        this.searchTerm = ''

        // Sets the search with 3 random chars
        for (let i = 0; this.searchTerm.length < 3; i++) {
          let rnd = Math.floor(Math.random() * 26)
          this.searchTerm = this.searchTerm.concat(this.alphabet[rnd])
        }
      }

      // Start search defaults
      let flashURL = new URL(`${this.uri}/${this.endpoint}/${api_key}/${this.searchTerm}`)
      this.endpoint = 'SearchMovie'

      // Asynchronous FN to fetch API (movie title and poster)
      async function ftMovie() {
        let resp = await fetch(flashURL, {
          method: 'get',
          redirect: 'follow',
        })

        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.errorMessage}`)
        }

        return resp.json()
      }

      // Call the FN to populate the movie data
      ftMovie()
        .then((resp) => {
          let flashURLInfo = URL
          let movieData = Object
          this.endpoint = 'Title' // endpoint to movie details (rating/year/runtime)

          if (!this.luckyMethod) {
            // if regular search received the first movie found
            flashURLInfo = new URL(`${this.uri}/${this.endpoint}/${api_key}/${resp.results[0].id}`)
            movieData = resp.results[0]
          } else {
            // if lucky search it draws a movie from data received
            const rnd = Math.floor(Math.random() * resp.results.length)
            flashURLInfo = new URL(`${this.uri}/${this.endpoint}/${api_key}/${resp.results[rnd].id}`)
            movieData = resp.results[rnd]
          }

          // Asynchronous FN to fetch API (movie details)
          async function ftMovieInfo() {
            let respInfo = await fetch(flashURLInfo, {
              method: 'get',
              redirect: 'follow',
            })

            if (!respInfo.ok) {
              throw new Error(`HTTP error! status: ${respInfo.errorMessage}`)
            }

            return respInfo.json()
          }

          ftMovieInfo().then((respInfo) => {
            return (this.movieInfo = respInfo) // Populates the movie details object
          })

          return (this.movie = movieData) // Populates the movie object
        })
        .catch((e) => {
          return console.log(e)
        })
    },
  },
}
</script>
