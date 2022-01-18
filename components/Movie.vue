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
      <v-img v-if="movie.poster" height="250" :src="movie.poster"></v-img>
      <v-img v-else height="250" :src="movie.image"></v-img>

      <v-card-title style="position: relative">
        {{ movie.title }}

        <v-btn absolute color="primary" class="white--text" :href="`https://www.imdb.com/title/${movie.id}`" target="movie" fab small right top>
          <v-icon>mdi-clipboard-text-outline</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="movie.rating">
        <v-row align="center" class="mx-0 d-flex flex-wrap">
          <v-rating :value="Number(movie.rating)" color="amber" dense half-increments readonly length="10" size="14" class="w-50"></v-rating>

          <div class="grey--text p-0 ms-4 w-auto">
            {{ movie.rating }}
          </div>

          <div class="grey--text p-0 ms-4 w-auto">
            {{ movie.year }}
          </div>

          <div class="grey--text pl-0 ms-4 w-auto">
            {{ movie.length }}
          </div>
        </v-row>

        <div class="my-4 text-subtitle-1">
          {{ movie.plot }}
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
const api_key = process.env.RAPIDAPI_KEY

export default {
  name: 'Movie',
  data() {
    return {
      alphabet: [...'abcdefghijklmnopqrstuvwxyz'],
      luckyMethod: Boolean,
      searchTerm: '',
      searchRules: [(value) => (value && value.length >= 3) || 'Min 3 characters'],
      movie: Object,
      uri: 'https://imdb-internet-movie-database-unofficial.p.rapidapi.com',
      endpoint: String,
    }
  },
  methods: {
    search() {
      // Setting defaults
      this.movie = {}
      this.endpoint = 'film'

      // Breaks if search field wrong
      if ((!this.searchTerm && !this.luckyMethod) || (this.searchTerm.length < 3 && !this.luckyMethod)) {
        return false
      }

      if (this.luckyMethod) {
        // Sets defaults for random search
        this.searchTerm = ''
        this.endpoint = 'search'

        // Sets the search with 3 random chars
        for (let i = 0; this.searchTerm.length < 3; i++) {
          let rnd = Math.floor(Math.random() * 26)
          this.searchTerm = this.searchTerm.concat(this.alphabet[rnd])
        }
      }

      let flashURL = new URL(`${this.uri}/${this.endpoint}/${this.searchTerm}`)

      // Asynchronous FN to fetch API
      async function ftMovie() {
        let resp = await fetch(flashURL, {
          method: 'get',
          headers: { 'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com', 'x-rapidapi-key': api_key },
          useQueryString: true,
        })

        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`)
        }

        return resp.json()
      }

      // Call the FN to populate the movie data
      ftMovie()
        .then((resp) => {
          if (this.endpoint === 'film') {
            return (this.movie = resp)
          } else {
            // If API endpoint = search data received are different
            const rnd = Math.floor(Math.random() * resp.titles.length)

            return (this.movie = resp.titles[rnd])
          }
        })
        .catch((e) => {
          return console.log(e)
        })
    },
  },
}
</script>
