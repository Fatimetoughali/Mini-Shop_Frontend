import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'MiniShop - Accueil' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { title: 'Votre Panier - MiniShop', requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: { title: 'Administration - MiniShop', requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Connexion - MiniShop' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Inscription - MiniShop' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

import { useAuthStore } from '@/stores/auth'

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'MiniShop'

  const authStore = useAuthStore()
  const isAuthenticated = !!localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  if (to.meta.requiresAdmin) {
    if (!authStore.isAdmin) {
      // If store state isn't ready but token exists, we might need to fetch user first
      // But for now, simple redirect
      next('/')
      return
    }
  }

  next()
})

export default router
