<template>
  <v-main>
    <v-container>
      <v-row>
        <h1>What's this?!</h1>

        <p>I like movies, I like Vue and Rest APIs too. So why not a dummy search movie project with it all?</p>
        <p>Find me here:</p>
      </v-row>
      <v-row>
        <v-list dense link v-for="item in items" :key="item.to">
          <v-list-item>
            <v-list-item-icon @click="goto(item.to)">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content @click="goto(item.to)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  layout: "default",
  name: "about",
  data() {
    return {
      title: "About",
      items: [
        {
          title: "Marcelo Munhoz website",
          icon: "mdi-post-outline",
          to: new URL("https://www.marcelomunhoz.com"),
        },
        {
          title: "Marcelo Munhoz on LinkedIn",
          icon: "mdi-linkedin",
          to: new URL("https://www.linkedin.com/in/marcelomunhoz"),
        },
        {
          title: "MarcMunhoz on Github",
          icon: "mdi-github",
          to: new URL("https://github.com/MarcMunhoz"),
        },
        {
          title: "heyMunhoz on Twitter",
          icon: "mdi-twitter",
          to: new URL("https://twitter.com/heyMunhoz"),
        },
      ],
    };
  },
  head() {
    return {
      title: this.title,
    };
  },
  methods: {
    goto(link: URL) {
      window.open(link.toString(), "new_window");
    },
  },
});
</script>

<style>
.v-list-item__icon,
.v-list-item__content {
  cursor: pointer;
}

.v-list-item__content {
  flex: unset;
}
</style>
