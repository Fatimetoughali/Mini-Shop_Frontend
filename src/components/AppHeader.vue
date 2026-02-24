<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const cart = useCartStore()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const route = useRoute()

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const switchLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
}

// Fermer le menu lors d'un changement de route
watch(
  () => route.path,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <header class="header">
    <div class="container header-content">
      <router-link to="/" class="logo">
        <div class="brand-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="bag-icon"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
            <path d="M3 6h18"></path>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <div class="logo-text-wrapper">
            <span class="logo-main">Mini</span><span class="logo-sub">Shop</span>
          </div>
        </div>
      </router-link>

      <div class="header-right">
        <div class="lang-switcher hide-mobile">
          <button @click="switchLanguage('fr')" :class="['lang-btn', { active: locale === 'fr' }]">
            FR
          </button>
          <button @click="switchLanguage('ar')" :class="['lang-btn', { active: locale === 'ar' }]">
            AR
          </button>
        </div>

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

        <button class="menu-toggle" @click="toggleMenu" aria-label="Menu">
          <svg
            v-if="!isMenuOpen"
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
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg
            v-else
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav :class="['nav-overlay', { active: isMenuOpen }]">
        <div class="nav-content">
          <div class="lang-switcher show-mobile">
            <button
              @click="switchLanguage('fr')"
              :class="['lang-btn', { active: locale === 'fr' }]"
            >
              FR
            </button>
            <button
              @click="switchLanguage('ar')"
              :class="['lang-btn', { active: locale === 'ar' }]"
            >
              AR
            </button>
          </div>

          <router-link to="/" class="nav-link">{{ t('common.home') }}</router-link>

          <template v-if="authStore.isAuthenticated">
            <div class="user-group">
              <template v-if="authStore.isAdmin">
                <router-link to="/admin" class="nav-link admin-link">{{
                  t('common.admin')
                }}</router-link>
              </template>
              <div class="user-info">
                <span class="username">{{ authStore.user?.name || 'Client' }}</span>
                <button @click="authStore.logout()" class="logout-btn">
                  {{ t('common.logout') }}
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="auth-group">
              <router-link to="/login" class="nav-link">{{ t('common.login') }}</router-link>
              <router-link to="/register" class="register-btn"> S'inscrire </router-link>
            </div>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  display: none;
  background: none;
  color: var(--text-main);
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.menu-toggle:hover {
  background-color: var(--bg-color);
}

.hide-mobile {
  display: flex;
}

.show-mobile {
  display: none;
}

.nav-overlay {
  display: flex;
  align-items: center;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.auth-group,
.user-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Base styles for existing classes */
.lang-switcher {
  display: flex;
  gap: 0.5rem;
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
  background-color: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  padding: 0.85rem 0;
  transition: all 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bag-icon {
  color: var(--primary-color);
  filter: drop-shadow(0 4px 6px rgba(99, 102, 241, 0.2));
}

.logo-text-wrapper {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  display: flex;
  align-items: center;
}

.logo-main {
  color: var(--primary-color);
}

.logo-sub {
  color: var(--text-main);
}

.nav-link {
  font-weight: 700;
  color: var(--text-muted);
  transition: all 0.3s ease;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
}

.nav-link:hover,
.router-link-active {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.05);
}

.admin-link {
  color: #ef4444;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.register-btn {
  background-color: var(--text-main);
  color: white !important;
  padding: 0.75rem 1.75rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.register-btn:hover {
  background-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(99, 102, 241, 0.3);
}

.logout-btn {
  background: #fff;
  border: 1.5px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
}

.logout-btn:hover {
  color: #ef4444;
  border-color: #fca5a5;
  background: #fef2f2;
}

.username {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.95rem;
}

.cart-btn {
  color: var(--text-main);
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: var(--accent-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2.5px solid white;
  box-shadow: 0 4px 8px rgba(244, 63, 94, 0.3);
}

/* Mobile Responsive Styles */
@media (max-width: 991px) {
  .menu-toggle {
    display: block;
  }

  .hide-mobile {
    display: none;
  }

  .show-mobile {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .nav-overlay {
    position: fixed;
    top: 73px; /* Header height */
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    padding: 2rem;
    flex-direction: column;
    align-items: flex-start;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 999;
  }

  .nav-overlay.active {
    transform: translateX(0);
  }

  .nav-content {
    flex-direction: column;
    width: 100%;
    align-items: center;
    gap: 2rem;
  }

  .auth-group,
  .user-group {
    flex-direction: column;
    width: 100%;
    gap: 2rem;
  }

  .user-info {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .nav-link {
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .register-btn {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }

  .username {
    font-size: 1.1rem;
    color: var(--text-muted);
  }

  .logout-btn {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .logo-text-wrapper {
    font-size: 1.2rem;
  }

  .logo-sub {
    display: none; /* Hide 'Shop' on very small screens to save space if needed */
  }
}
</style>
