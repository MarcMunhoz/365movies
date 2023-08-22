<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>365 Movies - {{ $route.name }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>1 movie per day of year, or almost it</q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" @click="toggleLeftDrawer" />
      </q-list>
    </q-drawer>

    <q-footer bordered reveal elevated class="flex justify-around bg-grey-3 text-primary">
      <q-item v-for="link in socialLinks" clickable tag="a" :href="link.to" target="_blank" class="w-1/4">
        <q-item-section v-if="link.icon" avatar>
          <q-icon :name="link.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Movie search",
    icon: "movie",
    link: "/",
  },
  {
    title: "Agenda",
    icon: "calendar_month",
    link: "/agenda",
  },
  {
    title: "About",
    icon: "info",
    link: "/about",
  },
];

const myLinks = [
  {
    title: "Marcelo Munhoz website",
    icon: "mdi-post-outline",
    to: "https://www.marcelomunhoz.com",
  },
  {
    title: "Marcelo Munhoz on LinkedIn",
    icon: "mdi-linkedin",
    to: "https://www.linkedin.com/in/marcelomunhoz",
  },
  {
    title: "MarcMunhoz on Github",
    icon: "mdi-github",
    to: "https://github.com/MarcMunhoz",
  },
  {
    title: "heyMunhoz on Twitter",
    icon: "mdi-twitter",
    to: "https://twitter.com/heyMunhoz",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      socialLinks: myLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        return (leftDrawerOpen.value = !leftDrawerOpen.value), (document.documentElement.scrollTop = 0);
      },
    };
  },
});
</script>
