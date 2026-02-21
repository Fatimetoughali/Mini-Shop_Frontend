<script setup>
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const cart = useCartStore()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const switchLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
}
</script>

<template>
  <header class="header">
    <div class="container header-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">🛍️</span>
        <span class="logo-text">Mini</span>Shop
      </router-link>

      <nav class="nav-menu">
        <div class="lang-switcher">
          <button @click="switchLanguage('fr')" :class="['lang-btn', { active: locale === 'fr' }]">
            FR
          </button>
          <button @click="switchLanguage('ar')" :class="['lang-btn', { active: locale === 'ar' }]">
            AR
          </button>
        </div>

        <router-link to="/" class="nav-link">{{ t('common.home') }}</router-link>

        <template v-if="authStore.isAuthenticated">
          <div class="user-menu fade-in">
            <template v-if="authStore.isAdmin">
              <router-link to="/admin" class="nav-link admin-link">{{
                t('common.admin')
              }}</router-link>
            </template>
            <span class="username">{{ authStore.user?.name || 'Client' }}</span>
            <button @click="authStore.logout()" class="logout-btn">{{ t('common.logout') }}</button>
          </div>
        </template>

        <template v-else>
          <div class="auth-groups fade-in">
            <router-link to="/login" class="nav-link">{{ t('common.login') }}</router-link>
            <router-link to="/register" class="register-btn"> S'inscrire </router-link>
          </div>
        </template>

        <router-link to="/cart" class="cart-btn">
          <div class="cart-icon-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span v-if="cart.totalItems > 0" class="badge">{{ cart.totalItems }}</span>
          </div>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 0.5rem;
  margin-right: 1rem;
}

.lang-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-muted);
}

.lang-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  text-decoration: none;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  color: var(--primary-color);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.auth-groups,
.user-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.2s;
  font-size: 0.95rem;
}

.nav-link:hover,
.router-link-active {
  color: var(--primary-color);
}

.admin-link {
  color: #dc2626; /* Red for admin */
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.register-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 99px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-decoration: none;
}

.register-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.logout-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  color: #ef4444;
  border-color: #fee2e2;
  background-color: #fef2f2;
}

.username {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
}

.cart-btn {
  color: var(--text-main);
  transition: transform 0.2s;
  margin-left: 0.5rem;
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-btn:hover {
  transform: scale(1.1);
  color: var(--primary-color);
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--accent-color);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 5px;
  line-height: 1;
  border-radius: 99px;
  box-shadow: 0 2px 4px rgba(236, 72, 153, 0.4);
  border: 2px solid white;
}

@media (max-width: 640px) {
  .nav-menu {
    gap: 1rem;
  }
  .username {
    display: none;
  }
}
</style>
