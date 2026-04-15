
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "Movie Search",
      },
      {
        path: "/about",
        component: () => import("pages/AboutPage.vue"),
        name: "About",
      },
      {
        path: "/agenda",
        component: () => import("pages/AgendaPage.vue"),
        name: "Agenda",
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
