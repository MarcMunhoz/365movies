<template>
  <v-container>
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> 365 Movies </v-list-item-title>
          <v-list-item-subtitle> 1 movie per day of year, or almost it </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>365 Movies</v-toolbar-title>
    </v-app-bar>
  </v-container>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      drawer: null,
      items: [
        { title: 'Home', icon: 'mdi-movie-open', to: '/' },
        // { title: 'Watched', icon: 'mdi-movie-open-check', to: '/watched' },
        { title: 'About', icon: 'mdi-information', to: '/about' },
      ],
    }
  },
}
</script>
