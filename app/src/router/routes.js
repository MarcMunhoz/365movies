
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'Search' },
      { path: '/about', component: () => import('pages/about.vue'), name: 'About' },
      { path: '/agenda', component: () => import('pages/agenda.vue'), name: 'Agenda' }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
