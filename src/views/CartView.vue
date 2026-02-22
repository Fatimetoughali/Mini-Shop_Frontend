<script setup>
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { orderApi } from '@/services/api'
import { useI18n } from 'vue-i18n'

const cart = useCartStore()
const router = useRouter()
const { t, locale } = useI18n()
const showPaymentModal = ref(false)
const paymentMethod = ref('') // 'bankily' or 'cash'
const phoneNumber = ref('')
const isProcessing = ref(false)

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

const handleCheckout = () => {
  showPaymentModal.value = true
}

const confirmPayment = async () => {
  const digitalMethods = ['bankily', 'sedad', 'masrvi', 'gazapay']
  if (digitalMethods.includes(paymentMethod.value) && !phoneNumber.value) {
    alert(
      locale.value === 'ar'
        ? 'يرجى إدخال رقم هاتفك للدفع'
        : 'Veuillez entrer votre numéro de téléphone pour le paiement',
    )
    return
  }

  isProcessing.value = true

  try {
    const orderData = {
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      payment_method: paymentMethod.value,
      phone_number: phoneNumber.value,
    }

    await orderApi.checkout(orderData)

    isProcessing.value = false

    const labels = {
      cash: 'Cash',
      bankily: 'Bankily',
      sedad: 'Sedad',
      masrvi: 'Masrvi',
      gazapay: 'GazaPay',
    }
    const methodLabel = labels[paymentMethod.value] || paymentMethod.value

    alert(
      locale.value === 'ar'
        ? `تهانينا! تم تسجيل طلبك بنجاح عبر ${methodLabel}.`
        : 'Félicitations ! Votre commande a été enregistrée avec succès via ' + methodLabel + '.',
    )
    cart.clearCart()
    showPaymentModal.value = false
    router.push('/')
  } catch (err) {
    console.error('Erreur lors de la commande:', err)
    alert(
      locale.value === 'ar'
        ? 'حدث خطأ أثناء تسجيل طلبك. يرجى المحاولة مرة أخرى.'
        : "Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer.",
    )
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="cart-view container">
    <h1 class="page-title">{{ t('cart.title') }}</h1>

    <div v-if="cart.items.length === 0" class="empty-state">
      <div class="empty-icon">🛒</div>
      <p>{{ t('cart.empty') }}</p>
      <router-link to="/" class="continue-btn">
        {{ locale === 'ar' ? 'اكتشف منتجاتنا' : 'Découvrir nos produits' }}
      </router-link>
    </div>

    <div v-else class="cart-layout">
      <!-- Cart Items List -->
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="getImageUrl(item)" :alt="item.name" />
          </div>

          <div class="item-details">
            <h3 class="item-title">{{ item.name }}</h3>
            <p class="item-price">{{ item.price.toFixed(0) }} MRU</p>
          </div>

          <div class="quantity-controls">
            <button
              @click="cart.updateQuantity(item.id, item.quantity - 1)"
              class="qty-btn"
              :disabled="item.quantity <= 1"
            >
              -
            </button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.id, item.quantity + 1)" class="qty-btn">
              +
            </button>
          </div>

          <button
            @click="cart.removeFromCart(item.id)"
            class="remove-btn"
            :title="locale === 'ar' ? 'إزالة من السلة' : 'Retirer du panier'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="cart-summary">
        <h2 class="summary-title">{{ t('cart.summary') }}</h2>

        <div class="summary-row">
          <span>{{ locale === 'ar' ? 'المجموع الفرعي' : 'Sous-total' }}</span>
          <span>{{ cart.totalPrice.toFixed(0) }} MRU</span>
        </div>

        <div class="summary-row">
          <span>{{ locale === 'ar' ? 'التوصيل' : 'Livraison' }}</span>
          <span class="free">{{ locale === 'ar' ? 'مجاني' : 'Gratuite' }}</span>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-total">
          <span>{{ t('cart.total') }}</span>
          <span>{{ cart.totalPrice.toFixed(0) }} MRU</span>
        </div>

        <button @click="handleCheckout" class="checkout-btn">{{ t('cart.checkout') }}</button>
      </div>
    </div>

    <!-- Modal de Paiement -->
    <div v-if="showPaymentModal" class="payment-modal-overlay">
      <div class="payment-modal">
        <button class="close-modal" @click="showPaymentModal = false">&times;</button>

        <h2>{{ t('cart.paymentMethod') }}</h2>

        <div class="payment-options">
          <label class="payment-option" :class="{ active: paymentMethod === 'bankily' }">
            <input type="radio" value="bankily" v-model="paymentMethod" />
            <div class="option-content">
              <span class="icon">📱</span>
              <div class="text">
                <strong>Bankily</strong>
                <p>{{ locale === 'ar' ? 'الدفع عبر بانكيلي' : 'Payer via Bankily' }}</p>
              </div>
            </div>
          </label>

          <label class="payment-option" :class="{ active: paymentMethod === 'sedad' }">
            <input type="radio" value="sedad" v-model="paymentMethod" />
            <div class="option-content">
              <span class="icon">🏦</span>
              <div class="text">
                <strong>Sedad</strong>
                <p>{{ locale === 'ar' ? 'الدفع عبر سداد' : 'Payer via Sedad' }}</p>
              </div>
            </div>
          </label>

          <label class="payment-option" :class="{ active: paymentMethod === 'masrvi' }">
            <input type="radio" value="masrvi" v-model="paymentMethod" />
            <div class="option-content">
              <span class="icon">💳</span>
              <div class="text">
                <strong>Masrvi</strong>
                <p>{{ locale === 'ar' ? 'الدفع عبر مصرفي' : 'Payer via Masrvi' }}</p>
              </div>
            </div>
          </label>

          <label class="payment-option" :class="{ active: paymentMethod === 'gazapay' }">
            <input type="radio" value="gazapay" v-model="paymentMethod" />
            <div class="option-content">
              <span class="icon">⚡</span>
              <div class="text">
                <strong>GazaPay</strong>
                <p>{{ locale === 'ar' ? 'الدفع عبر غزة باي' : 'Payer via GazaPay' }}</p>
              </div>
            </div>
          </label>

          <label class="payment-option" :class="{ active: paymentMethod === 'cash' }">
            <input type="radio" value="cash" v-model="paymentMethod" />
            <div class="option-content">
              <span class="icon">💵</span>
              <div class="text">
                <strong>{{
                  locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash à la livraison'
                }}</strong>
                <p>
                  {{
                    locale === 'ar'
                      ? 'الدفع نقداً عند استلام الطلب'
                      : 'Payer en espèces à la livraison'
                  }}
                </p>
              </div>
            </div>
          </label>
        </div>

        <div
          v-if="['bankily', 'sedad', 'masrvi', 'gazapay'].includes(paymentMethod)"
          class="digital-payment-info"
        >
          <div class="instruction-box">
            <p class="instruction-text">
              {{ t('cart.digitalInstruction') }}
              <span class="target-number">41613030</span>
            </p>
            <p class="screenshot-advice">
              {{ t('cart.screenshotAdvice') }}
              <a
                href="https://api.whatsapp.com/send?phone=22241613030"
                target="_blank"
                class="whatsapp-link"
              >
                {{ locale === 'ar' ? 'أرسلها عبر الواتساب' : 'Envoyer par WhatsApp' }}
              </a>
            </p>
          </div>

          <div class="form-group">
            <label>{{ t('cart.yourPhone') }}</label>
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="Ex: 41613030"
              maxlength="8"
              class="phone-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button
            @click="confirmPayment"
            class="confirm-btn"
            :disabled="!paymentMethod || isProcessing"
          >
            {{
              isProcessing
                ? t('common.loading')
                : t('cart.confirmOrder') + ' (' + cart.totalPrice.toFixed(0) + ' MRU)'
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-view {
  padding: 4rem 1rem;
  min-height: 80vh;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.continue-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 2rem;
  font-weight: 600;
  transition: transform 0.2s;
}

.continue-btn:hover {
  transform: translateY(-2px);
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
  gap: 1.5rem;
}

.item-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f8fafc;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.item-details {
  flex-grow: 1;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.item-price {
  color: var(--primary-color);
  font-weight: 700;
}

.quantity-controls {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.qty-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 0.25rem;
  font-weight: bold;
  color: var(--text-main);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-value {
  padding: 0 1rem;
  font-weight: 600;
  min-width: 2rem;
  text-align: center;
}

.remove-btn {
  color: var(--text-muted);
  background: transparent;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.remove-btn:hover {
  color: #ef4444;
  background: #fee2e2;
}

.cart-summary {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 100px;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-muted);
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 1.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 2rem;
}

.free {
  color: var(--success-color);
  font-weight: 600;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: var(--text-main);
  color: white;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  background-color: var(--primary-color);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

/* Payment Modal Styles */
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.payment-modal {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 1.5rem;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.close-modal {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  font-size: 1.5rem;
  background: #f1f5f9;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.payment-modal h2 {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  color: var(--text-main);
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.payment-option {
  border: 2px solid #f1f5f9;
  border-radius: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.payment-option input {
  width: 20px;
  height: 20px;
}

.payment-option.active {
  border-color: var(--primary-color);
  background: #ecfdf5;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.option-content .icon {
  font-size: 1.5rem;
}

.option-content strong {
  display: block;
  font-size: 1.1rem;
  color: var(--text-main);
}

.option-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.digital-payment-info {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 1rem;
  border: 1px dashed var(--primary-color);
  animation: fadeIn 0.3s ease;
}

.instruction-box {
  margin-bottom: 1.5rem;
  text-align: center;
}

.instruction-text {
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.target-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--primary-color);
  letter-spacing: 2px;
  margin: 0.5rem 0;
}

.screenshot-advice {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}

.whatsapp-link {
  color: #25d366;
  font-weight: 700;
  text-decoration: underline;
}

.digital-payment-info label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-main);
}

.phone-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #f1f5f9;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-align: center;
}

.confirm-btn {
  width: 100%;
  padding: 1.25rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

.confirm-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
