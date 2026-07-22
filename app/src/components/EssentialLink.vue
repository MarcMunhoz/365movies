<template>
  <q-item
    :to="link"
    exact
    :data-cy="navDataCy"
    class="app-nav-link q-mx-sm q-mb-xs rounded-borders border border-transparent transition-all duration-200 ease-in hover:translate-x-[2px]"
    :class="{ 'app-nav-link-active': isCurrentRoute(link) }"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { computed, defineComponent } from "vue";
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
  setup(props) {
    const route = useRoute();
    const navDataCy = computed(() => `nav-${props.title.toLowerCase().replace(/\s+/g, "-")}`);

    const isCurrentRoute = (targetLink) => {
      return route.path === targetLink;
    };

    return {
      isCurrentRoute,
      navDataCy,
    };
  },
});
</script>
