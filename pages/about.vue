<template>
  <v-main>
    <v-container>
      <v-row>
        <h1>What's this?!</h1>

        <p>I like movies, I like Vue and Rest APIs too. So why not a dummy project with it all?</p>
        <p>Find me here:</p>
      </v-row>
      <v-row>
        <v-list dense link v-for="item in items" :key="item.to">
          <v-list-item @click="goto(item.to)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'default',
  name: 'about',
  data() {
    return {
      items: [
        {
          title: 'Marcelo Munhoz website',
          icon: 'mdi-post-outline',
          to: 'https://www.marcelomunhoz.com',
        },
        {
          title: 'Marcelo Munhoz on LinkedIn',
          icon: 'mdi-linkedin',
          to: 'https://www.linkedin.com/in/marcelomunhoz',
        },
        {
          title: 'MarcMunhoz on Github',
          icon: 'mdi-github',
          to: 'https://github.com/MarcMunhoz',
        },
        {
          title: 'heyMunhoz on Twitter',
          icon: 'mdi-twitter',
          to: 'https://twitter.com/heyMunhoz',
        },
      ],
    }
  },
  methods: {
    goto(link: URL) {
      window.open(link.toString(), 'new_window')
    },
  },
})
</script>

<style></style>
