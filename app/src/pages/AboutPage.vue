<template>
  <q-page class="mx-auto w-full max-w-[1050px] px-3 pb-6 pt-4 md:px-5">
    <section data-cy="about-hero" class="about-hero-panel overflow-hidden rounded-2xl p-4 md:p-6">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <q-img
          :src="myPhoto ? `${myPhoto}?s=360` : '/img/no-image.jpg'"
          loading="lazy"
          class="mx-auto h-[170px] w-[170px] shrink-0 rounded-2xl border border-white/15 md:mx-0 md:h-[210px] md:w-[210px]"
        />

        <div class="min-w-0">
          <p class="about-kicker mb-2 text-xs uppercase tracking-[0.15em]">About the project</p>
          <h1 data-cy="about-title" class="font-['Sora'] text-3xl font-bold leading-tight md:text-4xl">365 Movies</h1>
          <p class="about-copy mt-3 text-[15px] leading-relaxed md:text-base">
            A personal movie discovery app built with Vue and APIs to search titles, explore details, and plan what to watch.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-4 grid gap-3 md:grid-cols-3">
      <article class="about-card rounded-xl p-4">
        <h2 class="mb-2 font-['Sora'] text-lg font-semibold">Search movies</h2>
        <p class="text-sm leading-relaxed">
          Use manual search for precise results, or the lucky mode to discover random options.
        </p>
      </article>

      <article class="about-card rounded-xl p-4">
        <h2 class="mb-2 font-['Sora'] text-lg font-semibold">Build your agenda</h2>
        <p class="text-sm leading-relaxed">
          Add movies to your watch plan, edit dates, and track watched status in list or calendar view.
        </p>
      </article>

      <article class="about-card rounded-xl p-4">
        <h2 class="mb-2 font-['Sora'] text-lg font-semibold">Local by design</h2>
        <p class="text-sm leading-relaxed">
          Your schedule is saved in your browser storage and stays on the current device.
        </p>
      </article>
    </section>

    <section class="about-card mt-4 rounded-xl p-4">
      <h2 class="mb-3 font-['Sora'] text-lg font-semibold">Connect</h2>
      <q-list class="about-link-list rounded-lg">
        <q-item v-for="link in socialLinks" :key="link.title" clickable tag="a" :href="link.to" target="_blank">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </section>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "About",
  data() {
    return {
      myPhoto: "",
      socialLinks: [
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
      ],
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
