<template>
  <q-layout view="hHh lpR fff" class="text-[#f3f6fa] [background:radial-gradient(circle_at_0%_0%,rgba(77,200,176,0.24),transparent_42%),radial-gradient(circle_at_100%_8%,rgba(255,143,107,0.2),transparent_36%),#0e141f]">
    <q-header class="border-b border-white/10 bg-[rgba(9,16,28,0.8)] backdrop-blur-[10px]">
      <q-toolbar class="gap-2 px-3 py-2">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="mr-1.5 border border-white/25" />

        <q-toolbar-title class="m-0 min-w-0 flex-1 p-0">
          <div class="flex w-full flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
            <div class="min-w-0 md:min-w-[170px] md:shrink-0">
              <div class="font-['Sora'] text-[1.35rem] font-bold leading-tight tracking-[0.02em]">365 MOVIES</div>
              <div class="text-xs uppercase tracking-[0.08em] text-[#95b7c2]">{{ $route.name }}</div>
            </div>

            <div class="flex min-w-0 w-full flex-1 items-start gap-2 md:items-center">
              <div class="min-w-0 flex-1">
                <q-input v-model="headerSearch" dense dark hide-bottom-space standout="bg-blue-grey-10 text-white" placeholder="Type movie title... And press Enter" input-class="!text-[#e8f0f8] placeholder:!text-[#9bb4c8]" class="flex-1 [&_.q-field__control]:rounded-[10px] [&_.q-field__bottom]:!text-[#ffb4a0]" :error="Boolean(searchValidationMessage)" :error-message="searchValidationMessage" @keyup.enter="runSearch" @update:model-value="clearSearchValidation">
                  <template #prepend>
                    <q-icon name="search" class="text-[#b4cbdd]" />
                  </template>
                </q-input>
              </div>
              <q-btn outline dense class="min-h-[34px] self-start whitespace-nowrap rounded-lg border-[rgba(255,192,154,0.7)] font-semibold normal-case text-[#ffc09a] md:self-auto" icon="casino" @click="runLucky">
                I'm lucky
              </q-btn>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-gradient-to-b from-[#121f31] to-[#0f1827]">
      <q-list class="pt-2">
        <q-item-label header class="font-semibold tracking-[0.05em] text-[#c4d7ea] opacity-95">1 movie per day of year, or almost it</q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" @click="toggleLeftDrawer" />
      </q-list>
    </q-drawer>

    <q-footer bordered reveal class="flex justify-around border-t border-white/10 bg-[rgba(8,14,24,0.88)] text-[#cfe2f4]">
      <q-item v-for="link in socialLinks" clickable tag="a" :href="link.to" target="_blank" class="w-auto text-inherit md:w-1/5">
        <q-item-section v-if="link.icon" avatar>
          <q-icon :name="link.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-footer>

    <q-page-container class="mb-8">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
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
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const headerSearch = ref("");
    const searchValidationMessage = ref("");

    watch(
      () => route.query.q,
      (query) => {
        headerSearch.value = typeof query === "string" ? query : "";
      },
      { immediate: true }
    );

    const goHomeWithQuery = (query) => {
      return router.push({
        path: "/",
        query,
      });
    };

    return {
      essentialLinks: linksList,
      socialLinks: myLinks,
      leftDrawerOpen,
      headerSearch,
      searchValidationMessage,
      toggleLeftDrawer() {
        return (leftDrawerOpen.value = !leftDrawerOpen.value), (document.documentElement.scrollTop = 0);
      },
      clearSearchValidation() {
        searchValidationMessage.value = "";
      },
      runSearch() {
        const query = headerSearch.value.trim();
        if (query.length < 3) {
          searchValidationMessage.value = "Please type at least 3 letters.";
          return false;
        }
        searchValidationMessage.value = "";
        return goHomeWithQuery({ q: query, run: Date.now().toString() });
      },
      runLucky() {
        searchValidationMessage.value = "";
        return goHomeWithQuery({ lucky: "1", run: Date.now().toString() });
      },
    };
  },
});
</script>
