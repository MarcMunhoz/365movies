<template>
  <q-page class="flex flex-center">
    <Movies />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import Movies from "../components/Movies.vue";

export default defineComponent({
  name: "Home",
  components: {
    Movies,
  },
});
</script>
