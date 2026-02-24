<script setup>
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cart = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const { locale } = useI18n()

const getImageUrl = (product) => {
  if (product.image_url) return product.image_url
  const imagePath = product.image
  if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image'
  if (imagePath.startsWith('http')) return imagePath
  const cleanPath = imagePath.replace(/^storage\//, '')
  let apiBase =
    import.meta.env.VITE_API_URL ||
    'https://morning-escarpment-60598-854031287859.herokuapp.com/api'
  apiBase = apiBase.replace(/\/api$/, '')
  return `${apiBase}/api/images/${cleanPath}`
}

const handleAddToCart = (product) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  cart.addToCart(product)
}
</script>

<template>
  <div class="product-card fade-in-up">
    <div class="image-wrapper">
      <div class="badge-overlay" v-if="product.is_new !== false">
        <span class="new-badge">New</span>
      </div>
      <img :src="getImageUrl(product)" :alt="product.name" loading="lazy" />
      <div class="image-action-overlay">
        <button @click="handleAddToCart(product)" class="quick-add-btn" aria-label="Quick Add">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="content">
      <div class="category-tag" v-if="product.category">{{ product.category.name }}</div>
      <h3 class="title">{{ product.name }}</h3>
      <p class="description">{{ product.description }}</p>

      <div class="footer">
        <div class="price-container">
          <span class="price-symbol"></span>
          <span class="price-value">{{ product.price.toLocaleString() }}</span>
          <span class="price-currency">MRU</span>
        </div>
        <button @click="handleAddToCart(product)" class="add-btn">
          <span>{{ locale === 'ar' ? 'إضافة' : 'Ajouter' }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="btn-icon"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--card-bg);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
  position: relative;
}

.product-card:hover {
  transform: translateY(-12px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.image-wrapper {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
  background-color: #f8fafc;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .image-wrapper img {
  transform: scale(1.1);
}

.badge-overlay {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
}

.new-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.35rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}

.image-action-overlay {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 2;
}

.product-card:hover .image-action-overlay {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn {
  background: white;
  color: var(--text-main);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  border: none;
}

.quick-add-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: rotate(15deg);
}

.content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: var(--text-main);
  line-height: 1.2;
}

.description {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 1rem;
}

.price-container {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
}

.price-currency {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
}

.add-btn {
  background-color: var(--text-main);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.add-btn:hover {
  background-color: var(--primary-color);
  padding-right: 1.5rem;
  transform: translateX(5px);
}

.add-btn:hover .btn-icon {
  transform: rotate(90deg);
}

.add-btn:active {
  transform: scale(0.95);
}
</style>
