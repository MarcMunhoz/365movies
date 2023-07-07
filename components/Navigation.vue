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
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link @click="drawer = !drawer">
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

      <v-toolbar-title>365 Movies - {{ pageName }}</v-toolbar-title>
    </v-app-bar>
  </v-container>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      drawer: false,
      items: [
        { title: "Home", icon: "mdi-movie-open", to: "/" },
        { title: "Month Movies", icon: "mdi-calendar", to: "/monthMovies" },
        { title: "About", icon: "mdi-information", to: "/about" },
      ],
    };
  },
  computed: {
    pageName() {
      const routeName = this.$route.name;
      const upperFirstChar = routeName.charAt(0).toUpperCase();
      const restName = routeName.slice(1).replace(/([A-Z])/g, " $1");

      const capitalizedRouteName = `${upperFirstChar}${restName}`;

      return capitalizedRouteName === "Index" ? "Home" : capitalizedRouteName;
    },
  },
};
</script>
