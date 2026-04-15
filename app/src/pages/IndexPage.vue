<template>
  <q-page class="flex flex-center">
    <MoviesView />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import MoviesView from "components/MoviesView.vue";

export default defineComponent({
  name: "Home",
  components: {
    MoviesView,
  },
});
</script>
