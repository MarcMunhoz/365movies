<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="searchTerm"
        label="Type anything and press ENTER"
        :rules="searchRules"
        hide-details="auto"
        @keyup.enter=";(luckyMethod = false), search()"
      >
      </v-text-field>
    </v-row>
    <v-row>
      <p class="h1 text-center my-4">OR</p>
    </v-row>
    <v-row>
      <v-btn depressed small color="primary" class="mx-auto mb-5 w-25" @click=";(luckyMethod = true), search()">I'm lucky!</v-btn>
    </v-row>
    <v-row v-if="progressLoader === true">
      <v-progress-circular :size="100" color="primary" class="mx-auto" indeterminate></v-progress-circular>
    </v-row>
    <v-card v-if="movie.Title" elevation="2" class="mt-4 mx-auto p-0" max-width="374">
      <!-- <v-img v-if="movie.Poster" height="250" :src="movie.Poster"></v-img> -->
      <v-img height="250" src="/img/no_image.jpg"></v-img>

      <img src="/img/no_image.jpg">

      <v-card-title style="position: relative">
        {{ movie.Title }}

        <v-btn absolute color="primary" class="white--text" :href="`https://www.imdb.com/title/${movie.imdbID}`" target="movie" fab small right top>
          <v-icon>mdi-clipboard-text-outline</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0 d-flex flex-wrap justify-content-center gap-3">
          <v-rating
            v-if="!movie.imdbRating =='N/A'"
            :value="Number(movie.imdbRating)"
            color="amber"
            dense
            half-increments
            readonly
            length="10"
            size="14"
            class="w-50"
          ></v-rating>

          <div v-if="!movie.imdbRating =='N/A'" class="grey--text p-0 w-auto">
            {{ movie.imdbRating }}
          </div>

          <div class="grey--text p-0 w-auto">
            {{ movie.year }}
          </div>

          <div class="grey--text pl-0 w-auto">
            {{ movie.Runtime }}
          </div>
        </v-row>

        <hr>

        <div class="mt-4 text-subtitle-1">
          <strong>Director:</strong> {{ movie.Director }}
        </div>

        <div class="text-subtitle-1">
          <strong>Actors:</strong> {{ movie.Actors }}
        </div>

        <div class="text-subtitle-1">
          <strong>Released:</strong> {{ movie.Released }}
        </div>

        <hr>

        <div class="my-4 text-subtitle-1">
          {{ movie.Plot }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
const api_key = process.env.OMDBAPI_KEY

export default {
  name: 'Movie',
  data() {
    return {
      alphabet: [...'abcdefghijklmnopqrstuvwxyz'],
      luckyMethod: Boolean,
      progressLoader: {
        type: Boolean,
        default: false,
      },
      searchTerm: '',
      searchRules: [(value) => (value && value.length >= 3) || 'Min 3 characters'],
      movie: Object,
      movieInfo: Object,
      uri: 'https://imdb-api.com/en/API',
      endpoint: String,
      flashURL: URL,
      flashURLInfo: URL,
    }
  },
  methods: {
    search() {
      this.movie = {}
      this.movieInfo = {}
      this.progressLoader = true

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

      this.flashURL = new URL(`https://www.omdbapi.com/?t=${this.searchTerm}&apikey=${api_key}`)
      this.fetchMovie()
    },
    fetchMovie() {
      let flashURL = this.flashURL

      // Asynchronous FN to fetch API (movie title and poster)
      async function ftMovie() {
        let resp = await fetch(flashURL, {
          method: 'get',
          redirect: 'follow',
        })

        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.error}`)
        }

        return resp.json()
      }

      // Calls the FN to populate the movie data
      ftMovie()
        .then((resp) => {
          this.progressLoader = false

          return this.movie = resp
        })
         .catch((e) => {
          return console.log(e)
        })
    }
  }
}
</script>
