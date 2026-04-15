<template>
  <q-page class="mx-auto w-full max-w-[1050px] px-3 pb-6 pt-4 md:px-5">
    <section class="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(130deg,rgba(14,32,50,0.92),rgba(10,22,36,0.9))] p-4 md:p-6">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <q-img
          :src="myPhoto ? `${myPhoto}?s=360` : '/img/no-image.jpg'"
          loading="lazy"
          class="mx-auto h-[170px] w-[170px] shrink-0 rounded-2xl border border-white/15 md:mx-0 md:h-[210px] md:w-[210px]"
        />

        <div class="min-w-0">
          <p class="mb-2 text-xs uppercase tracking-[0.15em] text-[#95b7c2]">About the project</p>
          <h1 class="font-['Sora'] text-3xl font-bold leading-tight text-[#e8f0f8] md:text-4xl">365 Movies</h1>
          <p class="mt-3 text-[15px] leading-relaxed text-[#c8d9e9] md:text-base">
            A personal movie discovery app built with Vue and APIs to search titles, explore details, and plan what to watch.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-4 grid gap-3 md:grid-cols-3">
      <article class="rounded-xl border border-white/10 bg-[rgba(10,20,33,0.72)] p-4">
        <h2 class="mb-2 font-['Sora'] text-lg font-semibold text-[#e7f1fb]">Search movies</h2>
        <p class="text-sm leading-relaxed text-[#b8cbe0]">
          Use manual search for precise results, or the lucky mode to discover random options.
        </p>
      </article>

      <article class="rounded-xl border border-white/10 bg-[rgba(10,20,33,0.72)] p-4">
        <h2 class="mb-2 font-['Sora'] text-lg font-semibold text-[#e7f1fb]">Build your agenda</h2>
        <p class="text-sm leading-relaxed text-[#b8cbe0]">
          Add movies to your watch plan, edit dates, and track watched status in list or calendar view.
        </p>
      </article>

      <article class="rounded-xl border border-white/10 bg-[rgba(10,20,33,0.72)] p-4">
        <h2 class="mb-2 font-['Sora'] text-lg font-semibold text-[#e7f1fb]">Local by design</h2>
        <p class="text-sm leading-relaxed text-[#b8cbe0]">
          Your schedule is saved in your browser storage and stays on the current device.
        </p>
      </article>
    </section>

    <section class="mt-4 rounded-xl border border-[#ffb58f4d] bg-[rgba(255,181,143,0.08)] p-4 text-[#ffd8c2]">
      <p class="text-sm leading-relaxed">
        <strong>Important:</strong> The agenda is local to each device/browser. If you switch devices or clear local data, your schedule will not be shared automatically.
      </p>
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
