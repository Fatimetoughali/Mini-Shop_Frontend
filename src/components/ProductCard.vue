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
  let apiBase = import.meta.env.VITE_API_URL || 'https://morning-escarpment-60598-854031287859.herokuapp.com/api'
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
  <div class="product-card">
    <div class="image-wrapper">
      <img :src="getImageUrl(product)" :alt="product.name" loading="lazy" />
    </div>

    <div class="content">
      <h3 class="title">{{ product.name }}</h3>
      <p class="description">{{ product.description }}</p>

      <div class="footer">
        <span class="price">{{ product.price.toFixed(0) }} MRU</span>
        <button @click="handleAddToCart(product)" class="add-btn">
          {{ locale === 'ar' ? 'إضافة' : 'Ajouter' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: var(--card-bg);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid transparent;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.image-wrapper {
  height: 200px;
  overflow: hidden;
  position: relative;
  background-color: #f1f5f9;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .image-wrapper img {
  transform: scale(1.1);
}

.content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
}

.description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary-color);
}

.add-btn {
  background-color: var(--text-main);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.add-btn:hover {
  background-color: var(--primary-color);
  transform: scale(1.05);
}

.add-btn:active {
  transform: scale(0.95);
}
</style>
