<template>
  <q-item :to="link" class="drawer-link q-mx-sm q-mb-xs rounded-borders">
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
.drawer-link {
  transition: all 0.2s ease;
  color: #dbe8f5 !important;
  border: 1px solid transparent;

  :deep(.q-icon) {
    color: #b8cee2 !important;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.09) !important;
    border-color: rgba(255, 255, 255, 0.16);
    transform: translateX(2px);
  }

  &.q-router-link--exact-active {
    background: linear-gradient(90deg, rgba(77, 200, 176, 0.3), rgba(77, 200, 176, 0.1)) !important;
    color: #e7fff9 !important;
    border: 1px solid rgba(77, 200, 176, 0.45);

    :deep(.q-icon) {
      color: #c8fff2 !important;
    }
  }
}
</style>
