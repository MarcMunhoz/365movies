<template>
  <q-layout view="hHh LpR fff" class="app-shell">
    <q-header class="app-header border-b backdrop-blur-[10px]">
      <q-toolbar class="gap-2 px-3 py-2">
        <q-btn v-if="isMobile" flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="mr-1.5 border border-white/25" />

        <q-toolbar-title class="m-0 min-w-0 flex-1 p-0">
          <div class="flex w-full flex-col gap-1.5 md:flex-row md:items-center md:gap-3">
            <div class="min-w-0 md:min-w-[170px] md:shrink-0">
              <div class="font-['Sora'] text-[1.35rem] font-bold leading-tight tracking-[0.02em]">365 MOVIES</div>
              <div class="app-route-label text-xs uppercase tracking-[0.08em]">{{ routeTitle }}</div>
            </div>

            <q-form class="flex min-w-0 w-full flex-1 items-start gap-2 md:items-center" @submit.prevent="runSearch">
              <div class="min-w-0 flex-1">
                <q-input v-model="headerSearch" dense hide-bottom-space standout="bg-blue-grey-10 text-white" :placeholder="t('settings.search.placeholder')" class="app-search-input flex-1 [&_.q-field__control]:rounded-[10px] [&_.q-field__bottom]:!text-[#ffb4a0]" :error="Boolean(searchValidationMessage)" :error-message="searchValidationMessage" @update:model-value="clearSearchValidation">
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-btn outline dense type="button" class="app-accent-button min-h-[34px] self-start whitespace-nowrap rounded-lg font-semibold normal-case md:self-auto" icon="casino" @click="runLucky">
                {{ t("settings.actions.lucky") }}
              </q-btn>
              <q-btn
                v-if="hasSearchToClear"
                flat
                dense
                round
                type="button"
                icon="close"
                :aria-label="t('settings.actions.clearSearch')"
                class="app-clear-search min-h-[34px] self-start md:self-auto"
                @click="clearSearch"
              >
                <q-tooltip>{{ t("settings.actions.clearSearch") }}</q-tooltip>
              </q-btn>
            </q-form>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="!isMobile && miniState"
      @mouseenter="handleDrawerMouseEnter"
      @mouseleave="handleDrawerMouseLeave"
      bordered
      class="app-drawer"
    >
      <div class="flex h-full flex-col">
        <q-list class="pt-2">
          <q-item-label header class="app-drawer-label font-semibold tracking-[0.05em] opacity-95">{{ t("layout.tagline") }}</q-item-label>

          <EssentialLink v-for="link in essentialLinks" :key="link.link" v-bind="link" @click="toggleLeftDrawer" />
        </q-list>

        <q-list class="app-settings-nav mt-auto pb-3 pt-3">
          <q-item
            clickable
            data-cy="nav-accessibility"
            class="app-nav-link q-mx-sm q-mb-xs rounded-borders border border-transparent transition-all duration-200 ease-in hover:translate-x-[2px]"
            @click="toggleAccessibilityMenu"
          >
            <q-item-section avatar>
              <q-icon name="accessibility_new" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Accessibility</q-item-label>
            </q-item-section>
          </q-item>
          <EssentialLink v-bind="settingsLink" @click="toggleLeftDrawer" />
        </q-list>
      </div>
    </q-drawer>

    <q-page-container class="mb-8">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import EssentialLink from "components/EssentialLink.vue";
import { useTranslations } from "composables/useTranslations";

const linksList = [
  {
    titleKey: "navigation.search",
    icon: "movie",
    link: "/",
  },
  {
    titleKey: "navigation.agenda",
    icon: "calendar_month",
    link: "/agenda",
  },
  {
    titleKey: "navigation.challenge",
    icon: "emoji_events",
    link: "/challenge",
  },
  {
    titleKey: "navigation.about",
    icon: "info",
    link: "/about",
  },
];

const settingsNavLink = {
  titleKey: "navigation.settings",
  icon: "settings",
  link: "/settings",
};

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const { t } = useTranslations();
    const isMobile = computed(() => $q.screen.lt.md);
    const leftDrawerOpen = ref(true);
    const headerSearch = ref("");
    const searchValidationMessage = ref("");
    const miniState = ref(false);
    const hasSearchToClear = computed(() =>
      Boolean(
        headerSearch.value.trim() ||
          route.query.q ||
          route.query.lucky ||
          sessionStorage.getItem("lastMovieSearch") ||
          sessionStorage.getItem("lastMovieSearchSnapshot")
      )
    );
    const localizeLink = (link) => ({
      ...link,
      title: t(link.titleKey),
    });
    const essentialLinks = computed(() => linksList.map(localizeLink));
    const settingsLink = computed(() => localizeLink(settingsNavLink));
    const routeTitle = computed(() => t(route.meta.titleKey || "navigation.search"));

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

    watch(
      isMobile,
      (mobile) => {
        if (mobile) {
          leftDrawerOpen.value = false;
          miniState.value = false;
          return;
        }

        leftDrawerOpen.value = true;
        miniState.value = false;
      },
      { immediate: true }
    );

    return {
      essentialLinks,
      isMobile,
      leftDrawerOpen,
      headerSearch,
      hasSearchToClear,
      routeTitle,
      searchValidationMessage,
      settingsLink,
      miniState,
      t,
      handleDrawerMouseEnter() {
        miniState.value = false;
      },
      handleDrawerMouseLeave() {
        miniState.value = false;
      },
      toggleLeftDrawer() {
        if (!isMobile.value) {
          leftDrawerOpen.value = true;
          document.documentElement.scrollTop = 0;
          return true;
        }

        leftDrawerOpen.value = !leftDrawerOpen.value;
        document.documentElement.scrollTop = 0;
        return true;
      },
      clearSearchValidation() {
        searchValidationMessage.value = "";
      },
      toggleAccessibilityMenu() {
        window.__movies365Accessibility?.toggleMenu?.();
      },
      runSearch() {
        const query = headerSearch.value.trim();
        if (query.length < 3) {
          searchValidationMessage.value = t("settings.search.invalid");
          return false;
        }
        searchValidationMessage.value = "";
        return goHomeWithQuery({ q: query, run: Date.now().toString() });
      },
      runLucky() {
        searchValidationMessage.value = "";
        return goHomeWithQuery({ lucky: "1", run: Date.now().toString() });
      },
      clearSearch() {
        headerSearch.value = "";
        searchValidationMessage.value = "";
        sessionStorage.removeItem("lastMovieSearch");
        sessionStorage.removeItem("lastMovieSearchSnapshot");

        return goHomeWithQuery({ clear: Date.now().toString() });
      },
    };
  },
});
</script>
