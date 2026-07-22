<template>
  <q-page class="w-full">
    <section
      data-cy="home-reminder-discovery"
      class="home-reminder-banner mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-[980px] flex-col gap-3 rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex min-w-0 items-start gap-3">
        <q-icon name="notifications_active" size="22px" class="home-reminder-icon mt-0.5 shrink-0" />
        <p class="m-0 text-sm leading-relaxed sm:text-[0.95rem]">
          agenda reminders can e-mail you when a planned movie is coming up.
        </p>
      </div>
      <q-btn
        data-cy="home-reminder-agenda"
        to="/agenda"
        no-caps
        unelevated
        icon-right="arrow_forward"
        label="Agenda"
        class="home-reminder-action min-h-[34px] shrink-0 rounded-lg px-3 text-sm font-semibold"
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
