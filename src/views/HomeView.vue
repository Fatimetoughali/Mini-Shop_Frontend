<script setup>
import { onMounted, computed, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductCard from '@/components/ProductCard.vue'
import { categoryApi } from '@/services/api'
import { useI18n } from 'vue-i18n'

const productStore = useProductStore()
const { t, locale } = useI18n()
const apiCategories = ref([])
const loadingCategories = ref(false)
const selectedCategoryId = ref(null)

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await categoryApi.getAll()
    apiCategories.value = response.data
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loadingCategories.value = false
  }
}

const filterByCategory = (categoryId) => {
  selectedCategoryId.value = categoryId
  productStore.fetchProducts({ category_id: categoryId })

  // Optional: scroll to products if filtered from category cards
  if (categoryId !== null) {
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
}

// Fallback icons for categories
const getCatIcon = (cat) => {
  if (cat.icon) return cat.icon
  const icons = {
    Électronique: '📱',
    الكترونيات: '📱',
    Mode: '👕',
    موضة: '👕',
    Maison: '🏠',
    منزل: '🏠',
    Beauté: '💄',
    جمال: '💄',
    Informatique: '💻',
    معلوماتية: '💻',
  }
  return icons[cat.name] || '📦'
}

onMounted(() => {
  productStore.fetchProducts()
  fetchCategories()
})

const scrollToProducts = () => {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' })
}

const features = computed(() => [
  {
    title: locale.value === 'ar' ? 'توصيل سريع' : 'Livraison Express',
    desc: locale.value === 'ar' ? 'توصيل في أقل من 24 ساعة' : 'Expédition en moins de 24h',
    icon: '⚡',
  },
  {
    title: locale.value === 'ar' ? 'دفع آمن' : 'Paiement Sécurisé',
    desc: locale.value === 'ar' ? 'طرق دفع موثوقة' : 'Transactions 100% protégées',
    icon: '🔒',
  },
  {
    title: locale.value === 'ar' ? 'دعم 24/7' : 'Support Client 24/7',
    desc: locale.value === 'ar' ? 'نحن بجانبك دائماً' : 'À votre écoute tous les jours',
    icon: '🎧',
  },
])
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="glow-sphere g1"></div>
      <div class="glow-sphere g2"></div>

      <div class="container hero-content">
        <div class="hero-text fade-in-up">
          <div class="promo-badge">
            <span class="sparkle">✨</span>
            <span class="badge-text">{{
              locale === 'ar' ? 'مجموعة 2026 الحصرية' : 'Collection Exclusive 2026'
            }}</span>
          </div>

          <h1 class="hero-title" v-html="t('home.heroTitle')"></h1>
          <p class="hero-subtitle">{{ t('home.heroSubtitle') }}</p>

          <div class="hero-actions">
            <button @click="scrollToProducts" class="btn-glow">
              <span>{{ t('home.buyNow') }}</span>
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
                class="arrow-icon"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button class="btn-ghost">{{ t('home.learnMore') }}</button>
          </div>

          <div class="hero-trust">
            <div class="avatars">
              <img src="https://i.pravatar.cc/150?u=1" alt="User" />
              <img src="https://i.pravatar.cc/150?u=2" alt="User" />
              <img src="https://i.pravatar.cc/150?u=3" alt="User" />
              <div class="more">+12k</div>
            </div>
            <p class="trust-text">
              <strong>4.9/5</strong>
              {{ locale === 'ar' ? 'من قبل +12 ألف عميل' : 'par +12k clients satisfaits' }}
            </p>
          </div>
        </div>

        <div class="hero-visual fade-in-up delay-200">
          <div class="visual-container">
            <div class="main-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=90"
                alt="Product High End"
                class="main-img"
              />
              <div class="glass-card g-1">
                <div class="icon-box">🏷️</div>
                <div class="text-box">
                  <span class="label">-20% OFF</span>
                  <span class="sub">Première commande</span>
                </div>
              </div>
              <div class="glass-card g-2">
                <div class="icon-box">🌟</div>
                <div class="text-box">
                  <span class="label">Produit Premium</span>
                  <span class="sub">Vérifié par nos experts</span>
                </div>
              </div>
            </div>
            <div class="floating-blobs">
              <div class="blob b1"></div>
              <div class="blob b2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features bar -->
      <div class="features-container container">
        <div class="features-wrapper">
          <div v-for="feat in features" :key="feat.title" class="feature-card">
            <div class="feature-icon">{{ feat.icon }}</div>
            <div class="feature-info">
              <h4>{{ feat.title }}</h4>
              <p>{{ feat.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section container">
      <div class="section-header fade-in-up">
        <h2 class="section-title">{{ t('home.categories') }}</h2>
        <div class="title-line"></div>
      </div>

      <div v-if="loadingCategories" class="loading-cats">
        <div class="pulse-ring"></div>
      </div>
      <div v-else class="category-grid">
        <div
          v-for="(cat, index) in apiCategories"
          :key="cat.id"
          class="cat-premium-card fade-in-up"
          :style="{ animationDelay: `${index * 100}ms` }"
          @click="filterByCategory(cat.id)"
        >
          <div class="cat-visual">
            <span class="cat-symbol">{{ getCatIcon(cat) }}</span>
            <div class="cat-hover-effect"></div>
          </div>
          <div class="cat-body">
            <h3>{{ cat.name }}</h3>
            <p>{{ locale === 'ar' ? 'استكشف الآن' : 'Découvrir maintenant' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <section id="products" class="products-section container">
      <div class="products-header">
        <div class="header-main">
          <h2 class="section-title">{{ t('home.products') }}</h2>
          <p class="header-sub">
            {{ locale === 'ar' ? 'اخترنا لك الأفضل دائماً' : 'Le meilleur pour vous, chaque jour' }}
          </p>
        </div>

        <div class="filter-wrapper">
          <div class="filter-tabs">
            <button
              :class="{ active: selectedCategoryId === null }"
              @click="filterByCategory(null)"
            >
              {{ locale === 'ar' ? 'الكل' : 'Tout' }}
            </button>
            <button
              v-for="cat in apiCategories"
              :key="cat.id"
              :class="{ active: selectedCategoryId === cat.id }"
              @click="filterByCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="productStore.loading" class="loader-container">
        <div class="modern-loader"></div>
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="productStore.error" class="error-premium">
        <div class="error-visual">⚠️</div>
        <h3>{{ locale === 'ar' ? 'فشل تحميل البيانات' : 'Service momentanément indisponible' }}</h3>
        <p>{{ productStore.error }}</p>
        <button @click="productStore.fetchProducts()" class="btn-glow small">
          {{ locale === 'ar' ? 'تحديث' : 'Rafraîchir' }}
        </button>
      </div>

      <div v-else-if="productStore.products.length === 0" class="empty-premium">
        <div class="empty-visual">✨</div>
        <h3>{{ locale === 'ar' ? 'قريباً جداً' : 'Arrivage imminent' }}</h3>
        <p>
          {{
            locale === 'ar'
              ? 'نحن نجهز لكم مجموعة مذهلة.'
              : 'De nouveaux produits arrivent très bientôt.'
          }}
        </p>
      </div>

      <div v-else class="products-grid">
        <ProductCard
          v-for="(product, index) in productStore.products"
          :key="product.id"
          :product="product"
          :style="{ animationDelay: `${index * 50}ms` }"
        />
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section container">
      <div class="cta-card fade-in-up">
        <div class="cta-content">
          <span class="cta-label">{{ locale === 'ar' ? 'عرض خاص' : 'Offre Spéciale' }}</span>
          <h2>{{ locale === 'ar' ? 'لا تفوت صفقات اليوم' : 'Ne manquez aucune offre' }}</h2>
          <p>
            {{
              locale === 'ar'
                ? 'اشترك في قائمتنا البريدية للحصول على خصومات حصرية.'
                : 'Inscrivez-vous pour recevoir des bons de réduction exclusifs.'
            }}
          </p>
          <form class="cta-form" @submit.prevent>
            <input
              type="email"
              :placeholder="locale === 'ar' ? 'بريدك الإلكتروني' : 'Votre adresse email'"
              required
            />
            <button type="submit">{{ locale === 'ar' ? 'اشتراك' : "M'abonner" }}</button>
          </form>
        </div>
        <div class="cta-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=90"
            alt="Special Offer"
          />
          <div class="image-overlay"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  overflow-x: hidden;
}

/* --- Hero Revamp --- */
.hero {
  position: relative;
  min-height: 90vh;
  padding: 8rem 0 6rem;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.glow-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.15;
}

.g1 {
  width: 500px;
  height: 500px;
  background: var(--primary-color);
  top: -100px;
  right: -100px;
}
.g2 {
  width: 400px;
  height: 400px;
  background: var(--accent-color);
  bottom: 100px;
  left: -100px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.promo-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(99, 102, 241, 0.08);
  padding: 0.5rem 1rem;
  border-radius: 99px;
  margin-bottom: 2rem;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.badge-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 4.8rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-main);
  margin-bottom: 2rem;
  letter-spacing: -3px;
}

.hero-subtitle {
  font-size: 1.35rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 3.5rem;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.btn-glow {
  background: var(--text-main);
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 1.25rem;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.btn-glow:hover {
  background: var(--primary-color);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

.btn-glow.small {
  padding: 0.8rem 2rem;
  font-size: 1rem;
}

.arrow-icon {
  transition: transform 0.3s ease;
}
.btn-glow:hover .arrow-icon {
  transform: translateX(5px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-main);
  padding: 1.25rem 2.5rem;
  border-radius: 1.25rem;
  font-weight: 700;
  border: 2px solid var(--border-color);
}

.btn-ghost:hover {
  background: #f8fafc;
  border-color: var(--text-main);
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatars {
  display: flex;
  margin-left: 0.5rem;
}

.avatars img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid white;
  margin-left: -12px;
}

.avatars img:first-child {
  margin-left: 0;
}

.avatars .more {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 3px solid white;
  margin-left: -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
}

.trust-text {
  font-size: 0.95rem;
  color: var(--text-muted);
}

/* --- Hero Visual --- */
.visual-container {
  position: relative;
  display: flex;
  justify-content: flex-end;
}

.main-image-wrapper {
  position: relative;
  width: 90%;
  z-index: 2;
}

.main-img {
  width: 100%;
  border-radius: 3rem;
  box-shadow: var(--shadow-xl);
  transform: rotate(-2deg);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.main-image-wrapper:hover .main-img {
  transform: rotate(0) scale(1.02);
}

.glass-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  padding: 1.25rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 3;
}

.g-1 {
  top: 10%;
  left: -20%;
  animation: float 5s ease-in-out infinite;
}
.g-2 {
  bottom: 10%;
  right: -5%;
  animation: float 5s ease-in-out infinite 1s;
}

.icon-box {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.text-box {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text-main);
}
.sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.floating-blobs .blob {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  filter: blur(40px);
}

.b1 {
  width: 150px;
  height: 150px;
  background: #c7d2fe;
  top: -20px;
  right: -20px;
}
.b2 {
  width: 100px;
  height: 100px;
  background: #fbcfe8;
  bottom: -20px;
  left: 10%;
}

/* --- Features Container --- */
.features-container {
  margin-top: 6rem;
}

.features-wrapper {
  background: white;
  padding: 3rem;
  border-radius: 2.5rem;
  box-shadow: 0 20px 60px -20px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-around;
  border: 1px solid #f1f5f9;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: #f8fafc;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background: var(--primary-color);
  color: white;
  transform: rotate(-10deg) scale(1.1);
}

.feature-info h4 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
}
.feature-info p {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* --- Section Styling --- */
.section-header {
  margin-bottom: 4rem;
  position: relative;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -1.5px;
}

.title-line {
  width: 80px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 10px;
  margin-top: 0.5rem;
}

/* --- Category Grid Premium --- */
.categories-section {
  padding: 8rem 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.cat-premium-card {
  background: white;
  border-radius: 2rem;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.cat-premium-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-xl);
  transform: translateY(-10px);
}

.cat-visual {
  width: 80px;
  height: 80px;
  background: #f8fafc;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  position: relative;
  overflow: hidden;
}

.cat-premium-card:hover .cat-visual {
  background: var(--primary-color);
}

.cat-body h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}
.cat-body p {
  font-size: 0.95rem;
  color: var(--text-muted);
  font-weight: 600;
  transition: color 0.3s;
}
.cat-premium-card:hover p {
  color: var(--primary-color);
}

/* --- Products Section --- */
.products-section {
  padding: 4rem 0 8rem;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.header-sub {
  font-size: 1.15rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.filter-tabs {
  background: #f1f5f9;
  padding: 0.4rem;
  border-radius: 1.25rem;
  display: flex;
  gap: 0.25rem;
}

.filter-tabs button {
  padding: 0.8rem 1.8rem;
  border-radius: 1rem;
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.filter-tabs button.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

/* --- Loader & State Styling --- */
.loader-container {
  padding: 8rem 0;
  text-align: center;
}
.modern-loader {
  width: 60px;
  height: 60px;
  border: 5px solid #f1f5f9;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --- CTA Section --- */
.cta-section {
  margin-bottom: 8rem;
}

.cta-card {
  background: var(--text-main);
  border-radius: 3.5rem;
  display: flex;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.4);
  position: relative;
  text-align: left;
  color: white;
}

.cta-image-wrapper {
  flex: 0.8;
  height: 500px;
  position: relative;
}

.cta-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--text-main), transparent);
}

.cta-content {
  flex: 1.2;
  padding: 6rem;
  position: relative;
  z-index: 2;
}

.cta-label {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 1.5rem;
}

.cta-card h2 {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: -2px;
}

.cta-card p {
  font-size: 1.2rem;
  color: #94a3b8;
  margin-bottom: 3.5rem;
}

.cta-form {
  display: flex;
  gap: 1rem;
  max-width: 500px;
}

.cta-form input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem 2rem;
  border-radius: 1.25rem;
  color: white;
  font-size: 1rem;
}

.cta-form button {
  background: white;
  color: var(--text-main);
  padding: 1.25rem 2.5rem;
  border-radius: 1.25rem;
  font-weight: 800;
}

.cta-form button:hover {
  background: var(--primary-color);
  color: white;
  transform: scale(1.05);
}

/* --- Responsive Premium --- */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 4rem;
  }
  .hero-content {
    gap: 2rem;
  }
}

@media (max-width: 991px) {
  .hero {
    padding-top: 6rem;
  }
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 6rem;
  }
  .hero-subtitle {
    margin-inline: auto;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-trust {
    justify-content: center;
  }
  .visual-container {
    justify-content: center;
  }
  .main-image-wrapper {
    width: 80%;
  }
  .g-1 {
    left: -10%;
  }
  .features-wrapper {
    flex-direction: column;
    gap: 3rem;
    text-align: left;
  }
  .cta-card {
    padding: 4rem 2rem;
  }
  .cta-card h2 {
    font-size: 2.5rem;
  }
  .cta-form {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 3rem;
    letter-spacing: -1px;
  }
  .hero-actions {
    flex-direction: column;
  }
  .btn-glow,
  .btn-ghost {
    width: 100%;
    justify-content: center;
  }
}
</style>
