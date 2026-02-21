import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productApi } from '@/services/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProducts(filters = {}) {
    loading.value = true
    error.value = null
    products.value = [] // Reset to avoid stale data
    try {
      const response = await productApi.getAll(filters)
      // Handle Laravel API Resource response (wrapped in data) or direct array
      const rawData = response.data
      products.value = Array.isArray(rawData) ? rawData : rawData.data || []

      console.log('✅ Produits chargés:', products.value.length)
      console.log('📦 Structure réponse:', rawData)
    } catch (err) {
      console.error('❌ Erreur lors du chargement des produits:', err)
      error.value =
        'Impossible de charger les produits. Assurez-vous que le backend est démarré sur http://localhost:8000'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await productApi.getById(id)
      return response.data
    } catch (err) {
      error.value = 'Erreur lors du chargement du produit.'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, fetchProducts, fetchProductById }
})
