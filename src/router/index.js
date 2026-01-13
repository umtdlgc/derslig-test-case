import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Events',
    component: () => import('../views/EventsPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/event/:id',
    name: 'EventDetail',
    component: () => import('../views/EventDetailPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/seat-plan/:eventId/:categoryId',
    name: 'SeatPlan',
    component: () => import('../views/SeatPlanPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../views/PaymentPage.vue'),
    meta: { layout: 'DefaultLayout' }
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: () => import('../views/PaymentSuccessPage.vue'),
    meta: { layout: 'EmptyLayout' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
