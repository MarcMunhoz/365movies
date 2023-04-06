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
      <v-btn disabled depressed small color="primary" class="mx-auto mb-5 w-25" @click=";(luckyMethod = true), search()">I'm lucky! (under maintenance)</v-btn>
    </v-row>
    <v-row v-if="progressLoader === true">
      <v-progress-circular :size="100" color="primary" class="mx-auto" indeterminate></v-progress-circular>
    </v-row>

    <div v-if="movie.Title" class="card mt-4 mx-auto p-0">
      <img v-if="movie.Poster && movie.Poster != 'N/A'" height="250" :src="movie.Poster" class="card-img-top object-fit-cover">
      <img v-else height="250" src="~/assets/img/no-image.jpg" class="card-img-top object-fit-cover">

      <div class="card-body">
        <v-btn absolute color="primary" class="white--text" :href="`https://www.imdb.com/title/${movie.imdbID}`" target="movie" fab small right top>
          <v-icon>mdi-clipboard-text-outline</v-icon>
        </v-btn>

        <h5 class="card-title">{{ movie.Title }}</h5>
        
        <div class="card-subtitle mx-0 d-flex flex-wrap justify-content-between">
          <v-rating
            v-if="movie.imdbRating !='N/A'"
            :value="Number(movie.imdbRating)"
            color="amber"
            dense
            half-increments
            readonly
            length="10"
            size="14"
            class="w-50"
          ></v-rating>

          <div v-if="movie.imdbRating !='N/A'" class="grey--text p-0 w-auto">
            {{ movie.imdbRating }}
          </div>

          <div class="grey--text p-0 w-auto">
            {{ movie.Year }}
          </div>

          <div class="grey--text pl-0 w-auto">
            {{ movie.Runtime }}
          </div>

          <hr class="w-100">

          <div class="text-subtitle-1 w-100">
            <strong>Director:</strong> {{ movie.Director }}
          </div>

          <div class="text-subtitle-1 w-100">
            <strong>Actors:</strong> {{ movie.Actors }}
          </div>

          <div class="text-subtitle-1 w-100">
            <strong>Genre:</strong> {{ movie.Genre }}
          </div>

          <hr class="w-100">
        </div>
        <p class="card-text">
          {{ movie.Plot }} <!-- API limit 230 chars //-->
        </p> 
      </div>
    </div>

    <div v-if="noMovie === true" class="text-center">
      <img src="~/assets/img/not-found.gif" class="mt-3 w-25">
    </div>
  </v-container>
</template>

<script>
const api_key = process.env.OMDBAPI_KEY

export default {
  name: 'Movie',
  data() {
    return {
      // alphabet: [...'abcdefghijklmnopqrstuvwxyz'],
      alphabet: ['bi','bo','bu','ta','se','tri','su','ke','ka','flo','ko','pi','pe','no','go','zo','fu','fo','si','pa','ar','es','i','kya','kyu','fle','o','ne','na','le','lu','ma','an'],
      luckyMethod: Boolean,
      progressLoader: {
        type: Boolean,
        default: false,
      },
      searchTerm: "",
      searchRules: [(value) => (value && value.length >= 3) || 'Min 3 characters'],
      movie: Object,
      noMovie: {
        type: Boolean,
        default: false,
      },
      flashURL: URL,
    }
  },
  methods: {
    search() {
      // Setting defaults
      this.movie = {}
      this.noMovie = false
      this.progressLoader = true

      // Breaks if search field wrong
      if ((!this.searchTerm && !this.luckyMethod) || (this.searchTerm.length < 3 && !this.luckyMethod)) {
        return false
      }

      if (this.luckyMethod) {
        // Sets defaults for random search
        this.searchTerm = ''

        // Sets the search with 3 random chars
        for (let i = 0; this.searchTerm.length < 6; i++) {
          let rnd = Math.floor(Math.random() * 32)
          this.searchTerm = this.searchTerm.concat(this.alphabet[rnd])
        }
      }

      this.flashURL = new URL(`https://www.omdbapi.com/?t=${this.searchTerm}&type=movie&apikey=${api_key}`)
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

          if (resp.Response == "False") {
            throw new Error(resp.Error)
          }

          return this.movie = resp
        })
         .catch((e) => {
          return (this.noMovie = true, console.log(e))
        })
    }
  }
}
</script>


<style lang="scss">
  .object-fit-cover {
    object-fit: cover;
  }

  .card {
    max-width: 374px;

    .card-body {
      position: relative;

      .card-text {
        text-align: justify;
      }
    }
  }
</style>