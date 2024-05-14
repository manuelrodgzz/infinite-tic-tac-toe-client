import { createRouter, createWebHistory } from 'vue-router'
import LocalGame from '@/views/LocalGame.vue'
import Home from '@/views/Home.vue'
import OnlineGame from '@/views/OnlineGame.vue'
import Online from '@/views/Online.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/online',
      name: 'online',
      component: Online
    },
    {
      path: '/local',
      name: 'local play',
      component: LocalGame
    },
    {
      path: '/online/:matchId',
      name: 'online match',
      component: OnlineGame
    }
  ]
})

export default router
