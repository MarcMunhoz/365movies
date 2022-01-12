<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="searchTerm"
        label="Type anything and press ENTER"
        :rules="rules"
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
      <v-img height="250" :src="movie.poster"></v-img>

      <v-card-title style="position: relative">
        {{ movie.title }}

        <v-btn absolute color="primary" class="white--text" :href="`https://www.imdb.com/title/${movie.id}`" target="movie" fab small right top>
          <v-icon>mdi-clipboard-text-outline</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0 d-flex flex-wrap">
          <v-rating :value="Number(movie.rating)" color="amber" dense half-increments readonly length="10" size="14" class="w-50"></v-rating>

          <div class="grey--text ms-4 w-auto">
            {{ movie.rating }}
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
const api_host = process.env.RAPIDAPI_HOST
const api_key = process.env.RAPIDAPI_KEY

export default {
  name: 'Movie',
  data() {
    return {
      alphabet: [...'abcdefghijklmnopqrstuvwxyz'],
      luckyMethod: Boolean,
      searchTerm: '',
      movie: Object,
      endpoint: 'https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/',
      rules: [(value) => (value && value.length >= 3) || 'Min 3 characters'],
    }
  },
  methods: {
    search() {
      this.movie = {}

      if ((!this.searchTerm && !this.luckyMethod) || (this.searchTerm.length < 3 && !this.luckyMethod)) {
        return false
      }

      if (this.luckyMethod) {
        this.searchTerm = ''

        for (let i = 0; this.searchTerm.length < 3; i++) {
          let rnd = Math.floor(Math.random() * 26)
          this.searchTerm = this.searchTerm.concat(this.alphabet[rnd])
        }
      }

      let flashURL = new URL(`${this.endpoint}${this.searchTerm}`)

      async function ftMovie() {
        let resp = await fetch(flashURL, { method: 'get', headers: { 'x-rapidapi-host': api_host, 'x-rapidapi-key': api_key } })

        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`)
        }

        return resp.json()
      }

      ftMovie()
        .then((resp) => {
          return (this.movie = resp)
        })
        .catch((e) => {
          return console.log(e)
        })
    },
  },
}
</script>
