import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const authStore = useAuthStore()

  const storageKey = computed(() => {
    return authStore.user ? `cart_items_${authStore.user.id}` : 'cart_items_guest'
  })

  // Load cart based on current user
  function loadCart() {
    const savedCart = localStorage.getItem(storageKey.value)
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    } else {
      items.value = []
    }
  }

  // Watch for user changes to reload appropriate cart
  watch(
    () => authStore.user,
    () => {
      loadCart()
    },
    { immediate: true },
  )

  // Watch for changes and save to localStorage using current key
  watch(
    items,
    (state) => {
      localStorage.setItem(storageKey.value, JSON.stringify(state))
    },
    { deep: true },
  )

  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))
  const totalPrice = computed(() =>
    items.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
  )

  function addToCart(product) {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  function removeFromCart(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((item) => item.id === productId)
    if (item && quantity > 0) {
      item.quantity = quantity
    } else if (item && quantity === 0) {
      removeFromCart(productId)
    }
  }

  function clearCart() {
    items.value = []
  }

  return { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }
})
