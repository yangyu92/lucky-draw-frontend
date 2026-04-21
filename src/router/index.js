import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('./views/Admin.vue')
  },
  {
    path: '/participants',
    name: 'Participants',
    component: () => import('./views/Participants.vue')
  },
  {
    path: '/prizes',
    name: 'Prizes',
    component: () => import('./views/Prizes.vue')
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('./views/Records.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
