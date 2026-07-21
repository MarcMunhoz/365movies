<template>
  <q-page class="w-full">
    <section
      data-cy="home-reminder-discovery"
      class="mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-[980px] flex-col gap-3 rounded-lg border border-[rgba(77,200,176,0.28)] bg-[rgba(10,22,32,0.72)] px-4 py-3 text-[#dce9f5] shadow-[0_10px_24px_rgba(0,0,0,0.22)] sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex min-w-0 items-start gap-3">
        <q-icon name="notifications_active" size="22px" class="mt-0.5 shrink-0 text-[#4dc8b0]" />
        <p class="m-0 text-sm leading-relaxed sm:text-[0.95rem]">
          agenda reminders can e-mail you when a planned movie is coming up.
        </p>
      </div>
      <q-btn
        to="/agenda"
        no-caps
        unelevated
        icon-right="arrow_forward"
        label="Agenda"
        class="min-h-[34px] shrink-0 rounded-lg bg-[#4dc8b0] px-3 text-sm font-semibold text-[#071018]"
      />
    </section>
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
