import { createRouter, createWebHistory } from 'vue-router'
import Rank from '../views/Rank.vue'
import Login from '../components/login/index.vue'
import Home from '../components/home/index.vue'
import RegisterComment from '../components/register-comment/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
    },
    {
      path: '/register-comment',
      name: 'register',
      component: RegisterComment,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ],
})

export default router
