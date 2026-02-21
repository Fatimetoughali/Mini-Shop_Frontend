import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.is_admin === true)

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login(credentials)
      const accessToken = response.data.access_token || response.data.token

      if (!accessToken) {
        throw new Error("Token d'authentification introuvable dans la réponse")
      }

      token.value = accessToken
      user.value = response.data.user
      localStorage.setItem('auth_token', token.value)

      // Skip immediate fetchUser to avoid potential 401 loops/race conditions
      // App.vue will fetch it on mount after reload
      /*
      try {
        await fetchUser()
      } catch (e) {
        console.warn('Could not fetch user profile after login')
      }
      */

      // Force a hard reload to ensure all states (headers, storage) are clean
      setTimeout(() => {
        window.location.href = '/'
      }, 100)

      return true
    } catch (err) {
      console.error('Login error:', err)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const errorMessages = Object.values(errors).flat().join('\n')
        error.value = errorMessages
      } else {
        error.value = err.response?.data?.message || err.message || 'Identifiants incorrects'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.register(userData)
      const accessToken = response.data.access_token || response.data.token

      if (!accessToken) {
        throw new Error("Token d'authentification introuvable dans la réponse")
      }

      token.value = accessToken
      user.value = response.data.user
      localStorage.setItem('auth_token', token.value)

      try {
        await fetchUser()
      } catch (e) {
        console.warn('Could not fetch user profile after register')
      }

      router.push('/')
      return true
    } catch (err) {
      console.error('Registration error:', err)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        // Format validation errors
        const errors = err.response.data.errors
        const errorMessages = Object.values(errors).flat().join('\n')
        error.value = errorMessages
      } else {
        error.value = err.response?.data?.message || err.message || "Erreur lors de l'inscription"
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
  }

  async function fetchUser() {
    if (!token.value) return

    loading.value = true
    try {
      const response = await authApi.getUser()
      user.value = response.data
    } catch (err) {
      console.error('Fetch user error:', err)
      if (err.response?.status === 401) {
        // Prevent infinite loop if already handled by axios interceptor or if already logged out
        if (token.value) {
          logout()
        }
      }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    fetchUser,
  }
})
