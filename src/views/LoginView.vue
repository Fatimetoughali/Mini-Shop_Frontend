<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = reactive({
  login: '',
  password: '',
})

const error = ref(null)

const showPassword = ref(false)

const handleLogin = async () => {
  error.value = null
  if (!form.login || !form.password) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  const success = await authStore.login(form)
  if (!success) {
    error.value = authStore.error || 'Identifiants incorrects'
  }
}
</script>

<template>
  <div class="auth-container fade-in">
    <div class="auth-card">
      <div class="card-header">
        <h2 class="title">Bienvenue</h2>
        <p class="subtitle">Email ou Numéro de téléphone pour accéder à votre compte</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login">Email ou Numéro de téléphone</label>
          <input
            id="login"
            v-model="form.login"
            type="text"
            placeholder="Votre email ou votre numéro"
            class="input-field"
            required
            autocomplete="username"
            aria-label="Email ou Numéro de téléphone"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="password-input-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="input-field"
              required
              autocomplete="current-password"
              aria-label="Mot de passe"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
              aria-label="Afficher le mot de passe"
            >
              <span v-if="showPassword">🙈</span>
              <span v-else>👁️</span>
            </button>
          </div>
        </div>

        <div v-if="error" class="error-msg" aria-live="polite" style="white-space: pre-wrap">
          {{ error }}
        </div>

        <button
          type="submit"
          class="submit-btn"
          :class="{ loading: authStore.loading }"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="spinner-sm"></span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <div class="card-footer">
        <p>
          Pas encore de compte ?
          <router-link to="/register" class="link">Créer un compte</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer */
  padding: 2rem;
  background-color: var(--bg-color);
}

.auth-card {
  background: white;
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
}

.input-field {
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  background-color: white;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper .input-field {
  width: 100%;
  padding-right: 2.5rem; /* Space for the button */
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0;
  display: flex;
  align-items: center;
  height: 100%;
}

.toggle-password:hover {
  opacity: 1;
}

.submit-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.75rem;
  background-color: #fef2f2;
  border-radius: 0.5rem;
  border: 1px solid #fee2e2;
}

.card-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.link {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  text-decoration: underline;
  color: var(--primary-hover);
}

/* Spinner for loading state */
.spinner-sm {
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
