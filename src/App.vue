<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { locale } = useI18n()

onMounted(() => {
  const savedLang = localStorage.getItem('lang') || 'fr'
  locale.value = savedLang
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = savedLang

  if (authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <div class="brand">
          <div class="brand-logo-footer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="bag-icon-footer"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <div class="logo-text-footer">
              <span class="logo-main">Mini</span><span class="logo-sub">Shop</span>
            </div>
          </div>
        </div>
        <p class="copyright">&copy; 2026 MiniShop. Fait avec passion.</p>
        <div class="links">
          <a href="#" class="footer-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Mentions Légales
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=22241613030"
            target="_blank"
            class="footer-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.5 8.5 0 0 1 7.6 10.6 Z"
              />
              <path d="M16 12l-4 4-4-4" />
            </svg>
            Contact WhatsApp
          </a>
        </div>
      </div>
    </footer>

    <!-- Bouton flottant WhatsApp -->
    <a
      href="https://api.whatsapp.com/send?phone=22241613030"
      class="whatsapp-float"
      target="_blank"
      title="Contactez-nous sur WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path
          d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.2-157.1zM223.9 446.9c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 367.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.9-186.6 184.9zm101.7-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.8-27.8-33.1-31.1-38.6-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.6-9.3 1.8-3.7 .9-7-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
        />
      </svg>
    </a>
  </div>
</template>

<style scoped>
.whatsapp-float {
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 40px;
  right: 40px;
  background-color: var(--primary-color);
  color: #fff;
  border-radius: 50px;
  text-align: center;
  font-size: 30px;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  background-color: #128c7e;
}
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.footer {
  background-color: white;
  border-top: 1px solid var(--border-color);
  padding: 3rem 0;
  margin-top: 4rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-muted);
}

.brand-logo-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bag-icon-footer {
  color: var(--primary-color);
}

.logo-text-footer {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.logo-main {
  color: var(--primary-color);
}

.logo-sub {
  color: var(--text-main);
}

.links {
  display: flex;
  gap: 2rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--primary-color);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}
</style>
