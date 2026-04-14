<template>
  <q-layout view="hHh lpR fff" class="app-shell">
    <q-header class="app-header">
      <q-toolbar class="px-3 py-2">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="header-menu-btn" />

        <q-toolbar-title>
          <div class="header-content">
            <div class="header-brand">
              <div class="header-title">365 MOVIES</div>
              <div class="header-subtitle">{{ $route.name }}</div>
            </div>

            <div class="header-search">
              <q-input
                v-model="headerSearch"
                dense
                standout="bg-blue-grey-10 text-white"
                placeholder="Search movie title..."
                class="header-search-input"
                :error="Boolean(searchValidationMessage)"
                :error-message="searchValidationMessage"
                @keyup.enter="runSearch"
                @update:model-value="clearSearchValidation"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-btn unelevated dense class="header-lucky-btn" @click="runLucky">I'm lucky</q-btn>
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-gradient-to-b from-[#121f31] to-[#0f1827]">
      <q-list class="pt-2">
        <q-item-label header class="drawer-heading">1 movie per day of year, or almost it</q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" @click="toggleLeftDrawer" />
      </q-list>
    </q-drawer>

    <q-footer bordered reveal class="app-footer flex justify-around">
      <q-item v-for="link in socialLinks" clickable tag="a" :href="link.to" target="_blank" class="w-auto md:w-1/5 footer-link">
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

<style lang="scss" scoped>
.app-shell {
  background: radial-gradient(circle at 0% 0%, rgba(77, 200, 176, 0.24), transparent 42%),
    radial-gradient(circle at 100% 8%, rgba(255, 143, 107, 0.2), transparent 36%), #0e141f;
  color: #f3f6fa;
}

.app-header {
  background: rgba(9, 16, 28, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);

  .header-menu-btn {
    border: 1px solid rgba(255, 255, 255, 0.25);
    margin-right: 0.4rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .header-brand {
    min-width: 170px;
  }

  .header-title {
    font-family: "Sora", sans-serif;
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: 0.02em;
  }

  .header-subtitle {
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #95b7c2;
  }

  .header-search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .header-search-input {
    flex: 1;

    :deep(.q-field__control) {
      border-radius: 10px;
    }

    :deep(.q-field__native),
    :deep(.q-field__input) {
      color: #e8f0f8 !important;
    }

    :deep(.q-field__native::placeholder),
    :deep(.q-field__input::placeholder) {
      color: #9bb4c8 !important;
      opacity: 1;
    }

    :deep(.q-field__prepend .q-icon) {
      color: #b4cbdd !important;
    }

    :deep(.q-field__bottom) {
      color: #ffb4a0 !important;
    }
  }

  .header-search-btn {
    min-height: 34px;
    border-radius: 8px;
    background: #4dc8b0;
    color: #0e1b2a;
    font-weight: 700;
  }

  .header-lucky-btn {
    min-height: 34px;
    border-radius: 8px;
    background: #ff8f6b;
    color: #151e2d;
    font-weight: 700;
  }
}

.app-drawer {

  :deep(.q-scrollarea),
  :deep(.q-scrollarea__container),
  :deep(.q-scrollarea__content),
  :deep(.q-scrollarea__content > div),
  :deep(.q-drawer__content > div),
  :deep(.q-item),
  :deep(.q-item__section),
  :deep(.q-item__label) {
    background-color: transparent !important;
    color: #e5eff8 !important;
  }

  .drawer-heading {
    color: #c4d7ea;
    letter-spacing: 0.05em;
    font-weight: 600;
    opacity: 0.95;
  }
}

.app-footer {
  background: rgba(8, 14, 24, 0.88);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #cfe2f4;

  .footer-link {
    color: inherit;
  }
}

@media (max-width: 840px) {
  .app-header {
    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 0.4rem;
    }

    .header-brand {
      min-width: unset;
    }
  }
}
</style>
