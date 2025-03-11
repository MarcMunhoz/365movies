<template>
  <q-dialog v-model="trailerDialog" full-width full-height persistent>
    <q-card class="flex flex-col h-screen">
      <q-card-section class="flex justify-end pb-0">
        <q-btn icon="close" color="primary" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="flex-grow flex items-center justify-center">
        <q-video :src="`https://www.youtube.com/embed/${trailerId}?origin=${origin}`" class="w-full h-full" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Define a prop para receber o ID do vídeo
const props = defineProps({
  trailerId: {
    type: String,
    required: true,
    default: "undefined",
  },
});

const origin = ref(null);
const trailerDialog = ref(false);

// Função para abrir o dialog
const openDialog = () => {
  trailerDialog.value = true;
};

onMounted(() => {
  return (origin.value = window.location.origin);
});

// Expõe a função openDialog para o componente pai
defineExpose({
  openDialog,
});
</script>
