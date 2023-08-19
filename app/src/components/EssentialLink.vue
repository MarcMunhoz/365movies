<template>
  <q-item :to="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

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
});
</script>

<style lang="scss" scoped>
a {
  &.q-router-link--active {
    background-color: $indigo-1 !important;
  }

  &:not(.q-router-link--exact-active) {
    background-color: unset !important;
    color: $blue-grey-5 !important;
  }
}
</style>
