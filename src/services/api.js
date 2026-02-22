import axios from 'axios'

// Configuration de l'URL de base de votre API Laravel
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://morning-escarpment-60598-854031287859.herokuapp.com/api'

// Création d'une instance Axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 secondes
})

// Intercepteur pour ajouter le token d'authentification si disponible
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

// API des produits
export const productApi = {
  getAll: (params) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) =>
    apiClient.post('/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (id, data) => {
    // If data is FormData, use POST with _method
    if (data instanceof FormData) {
      return apiClient.post(`/products/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }
    return apiClient.put(`/products/${id}`, data)
  },
  delete: (id) => apiClient.delete(`/products/${id}`),
}

// API des commandes
export const orderApi = {
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  checkout: (data) => apiClient.post('/checkout', data),
  getUserOrders: () => apiClient.get('/orders/user'),
  getAllAdmin: () => apiClient.get('/orders/all'),
}

// API d'authentification
export const authApi = {
  login: (credentials) => apiClient.post('/login', credentials),
  register: (userData) => apiClient.post('/register', userData),
  logout: () => apiClient.post('/logout'),
  getUser: () => apiClient.get('/user'),
}

// API du panier (si vous avez un panier côté serveur)
export const cartApi = {
  get: () => apiClient.get('/cart'),
  add: (productId, quantity) => apiClient.post('/cart', { product_id: productId, quantity }),
  update: (itemId, quantity) => apiClient.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => apiClient.delete(`/cart/${itemId}`),
  clear: () => apiClient.delete('/cart'),
}

// API des catégories
export const categoryApi = {
  getAll: () => apiClient.get('/categories'),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
}

export default apiClient
