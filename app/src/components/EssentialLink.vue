<template>
  <q-item
    :to="link"
    class="q-mx-sm q-mb-xs rounded-borders border border-transparent text-[#dbe8f5] transition-all duration-200 ease-in hover:translate-x-[2px] hover:border-white/20 hover:bg-white/10 [&.q-router-link--active]:text-[#dbe8f5]"
    :class="isCurrentRoute(link) ? 'border-[#4dc8b073] bg-[linear-gradient(90deg,rgba(77,200,176,0.3),rgba(77,200,176,0.1))] text-[#e7fff9]' : ''"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" class="text-[#b8cee2]" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: "#",
    },
    icon: {
      type: String,
      default: "",
    },
  },
  setup() {
    const route = useRoute();

    const isCurrentRoute = (targetLink) => {
      return route.path === targetLink;
    };

    return {
      isCurrentRoute,
    };
  },
});
</script>
