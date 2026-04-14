<template>
  <q-page class="flex flex-center content-center justify-center p-3 text-[16px]">
    <h1 class="text-3xl text-center w-full">What's this?!</h1>

    <q-img :src="`${myPhoto}?s=200`" loading="lazy" width="200px" class="rounded-lg mr-5" />

    <p>
      I like movies, I like Vue and Rest APIs too. So why not a little search movie project with all that?<br /><br />
      Here you can search for a movie by title, or keyword. You can mark it on the agenda and have an overview of all the movies you want to watch during the current year.<br /><br />
      * <strong>Important:</strong> The schedule works locally on the device in which each movie is marked.
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  data() {
    return {
      myPhoto: "",
    };
  },
  mounted() {
    return this.getGravatar();
  },
  methods: {
    getGravatar() {
      const gravatarURL = "https://en.gravatar.com/mmunhoz.json";

      fetch(gravatarURL)
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`Network response was not ok: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          return (this.myPhoto = data.entry[0].thumbnailUrl);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    },
  },
});
</script>
