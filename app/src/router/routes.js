
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "Movie Search",
        meta: { titleKey: "navigation.search" },
      },
      {
        path: "/about",
        component: () => import("pages/AboutPage.vue"),
        name: "About",
        meta: { titleKey: "navigation.about" },
      },
      {
        path: "/agenda",
        component: () => import("pages/AgendaPage.vue"),
        name: "Agenda",
        meta: { titleKey: "navigation.agenda" },
      },
      {
        path: "/challenge",
        component: () => import("pages/ChallengePage.vue"),
        name: "Challenge",
        meta: { titleKey: "navigation.challenge" },
      },
      {
        path: "/settings",
        component: () => import("pages/SettingsPage.vue"),
        name: "Settings",
        meta: { titleKey: "navigation.settings" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes
