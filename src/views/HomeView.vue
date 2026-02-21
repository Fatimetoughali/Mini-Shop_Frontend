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
      <div class="container hero-content">
        <div class="hero-text fade-in">
          <span class="badge-new">{{
            locale === 'ar' ? 'مجموعة 2026 الحصرية' : 'Collection Exclusive 2026'
          }}</span>
          <h1 class="hero-title" v-html="t('home.heroTitle')"></h1>
          <p class="hero-subtitle">{{ t('home.heroSubtitle') }}</p>
          <div class="hero-buttons">
            <button @click="scrollToProducts" class="btn-primary">
              {{ t('home.buyNow') }}
              <span class="arrow">→</span>
            </button>
            <button class="btn-outline">{{ t('home.learnMore') }}</button>
          </div>

          <div class="hero-stats">
            <div class="stat-bubble">
              <strong>50k+</strong>
              <span>{{ locale === 'ar' ? 'عميل سعيد' : 'Clients' }}</span>
            </div>
            <div class="stat-bubble">
              <strong>4.9/5</strong>
              <span>{{ locale === 'ar' ? 'تقييم ممتاز' : 'Avis' }}</span>
            </div>
          </div>
        </div>

        <div class="hero-visual fade-in delay-200">
          <div class="visual-wrapper">
            <div class="glow-bg"></div>
            <div class="image-stack">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Feature Product"
                class="img-main"
              />
              <div class="floating-card p1">
                <span class="icon">✨</span>
                <span>Premium Quality</span>
              </div>
              <div class="floating-card p2">
                <span class="icon">🏷️</span>
                <span>Meilleurs Prix</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature bar -->
      <div class="features-bar container">
        <div v-for="feat in features" :key="feat.title" class="feature-item">
          <span class="feat-icon">{{ feat.icon }}</span>
          <div class="feat-text">
            <h4>{{ feat.title }}</h4>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section container">
      <div class="section-header">
        <h2 class="section-title">{{ t('home.categories') }}</h2>
        <p class="section-subtitle">
          {{ locale === 'ar' ? 'تصفح حسب اهتماماتك' : "Trouvez ce qu'il vous faut par thématique" }}
        </p>
      </div>

      <div v-if="loadingCategories" class="loading-cats">
        <div class="spinner-small"></div>
      </div>
      <div v-else class="category-grid">
        <div
          v-for="cat in apiCategories"
          :key="cat.id"
          class="category-card"
          @click="filterByCategory(cat.id)"
        >
          <div class="cat-icon-wrapper">
            <span class="cat-icon">{{ getCatIcon(cat) }}</span>
          </div>
          <h3>{{ cat.name }}</h3>
          <span class="cat-count">{{
            locale === 'ar' ? 'عرض المنتجات ←' : 'Voir les produits →'
          }}</span>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <section id="products" class="products-section container">
      <div class="products-header">
        <h2 class="section-title">{{ t('home.products') }}</h2>
        <div class="filter-tabs">
          <button :class="{ active: selectedCategoryId === null }" @click="filterByCategory(null)">
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

      <div v-if="productStore.loading" class="state-container">
        <div class="pulse-loader"></div>
        <p>{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="productStore.error" class="error-container">
        <img src="https://cdn-icons-png.flaticon.com/512/595/595067.png" width="60" alt="error" />
        <h3>{{ locale === 'ar' ? 'عذراً، حدث خطأ ما' : 'Oups, une erreur est survenue' }}</h3>
        <p>{{ productStore.error }}</p>
        <button @click="productStore.fetchProducts()" class="btn-retry">
          {{ locale === 'ar' ? 'إعادة المحاولة' : 'Réessayer' }}
        </button>
      </div>

      <div v-else-if="productStore.products.length === 0" class="empty-container">
        <div class="empty-vector">📦</div>
        <h3>{{ locale === 'ar' ? 'لا توجد منتجات متاحة' : 'Indisponible' }}</h3>
        <p>
          {{
            locale === 'ar'
              ? 'عد لاحقاً لاكتشاف أحدث منتجاتنا.'
              : 'Nous ajoutons des produits prochainement.'
          }}
        </p>
      </div>

      <div v-else class="products-grid">
        <ProductCard
          v-for="product in productStore.products"
          :key="product.id"
          :product="product"
          class="fade-in-up"
        />
      </div>
    </section>

    <!-- Experience / Newsletter Section -->
    <section class="banner-section container">
      <div class="banner-card">
        <div class="banner-content">
          <h2>{{ locale === 'ar' ? 'ابق على اطلاع دائم' : 'Ne manquez aucune offre' }}</h2>
          <p>
            {{
              locale === 'ar'
                ? 'اشترك لتصلك أفضل العروض والمنتجات الحصرية.'
                : 'Inscrivez-vous pour recevoir des bons de réduction exclusifs.'
            }}
          </p>
          <form class="subscribe-form" @submit.prevent>
            <input
              type="email"
              :placeholder="locale === 'ar' ? 'بريدك الإلكتروني' : 'Votre adresse email'"
              required
            />
            <button type="submit">{{ locale === 'ar' ? 'اشتراك' : "M'abonner" }}</button>
          </form>
        </div>
        <div class="banner-image">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Banner"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  background-color: #fcfdfe;
}

/* --- Hero Section --- */
.hero {
  position: relative;
  background: radial-gradient(circle at top right, #eef2ff 0%, #ffffff 50%);
  padding: 8rem 0 4rem;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
}

.badge-new {
  display: inline-block;
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  padding: 0.6rem 1.25rem;
  border-radius: 99px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 2rem;
  color: #1a1c21;
  letter-spacing: -2px;
}

.hero-subtitle {
  font-size: 1.35rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 580px;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.btn-primary {
  background: #1a1c21;
  color: white;
  padding: 1.1rem 2.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 30px rgba(79, 70, 229, 0.3);
}

.btn-outline {
  background: white;
  color: #1a1c21;
  border: 2px solid #e2e8f0;
  padding: 1.1rem 2.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  border-color: #1a1c21;
  background: #f8fafc;
}

.hero-stats {
  display: flex;
  gap: 3rem;
}

.stat-bubble {
  display: flex;
  flex-direction: column;
}

.stat-bubble strong {
  font-size: 1.75rem;
  color: #1a1c21;
}

.stat-bubble span {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* --- Hero Visual --- */
.visual-wrapper {
  position: relative;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glow-bg {
  position: absolute;
  width: 450px;
  height: 450px;
  background: #4f46e5;
  filter: blur(120px);
  opacity: 0.15;
  border-radius: 50%;
}

.image-stack {
  position: relative;
  z-index: 2;
}

.img-main {
  width: 100%;
  max-width: 480px;
  border-radius: 2.5rem;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.2);
  transform: rotate(2deg);
  transition: transform 0.6s ease;
}

.image-stack:hover .img-main {
  transform: rotate(0) scale(1.05);
}

.floating-card {
  position: absolute;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 3;
}

.p1 {
  top: 10%;
  right: -10%;
  animation: float 4s ease-in-out infinite;
}
.p2 {
  bottom: 15%;
  left: -15%;
  animation: float 4s ease-in-out infinite 1s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* --- Features Bar --- */
.features-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: white;
  padding: 2.5rem;
  border-radius: 2rem;
  box-shadow: 0 15px 50px -15px rgba(0, 0, 0, 0.08);
  margin-top: 4rem;
  position: relative;
  z-index: 10;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 2rem;
}

.feature-item:not(:last-child) {
  border-right: 1px solid #f1f5f9;
}

.feat-icon {
  font-size: 2rem;
  background: #f8fafc;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
}

.feat-text h4 {
  margin: 0;
  color: #1a1c21;
  font-size: 1.1rem;
}
.feat-text p {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

/* --- Categories Section --- */
.categories-section {
  padding: 8rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}
.section-title {
  font-size: 2.75rem;
  font-weight: 900;
  color: #1a1c21;
  margin-bottom: 1rem;
}
.section-subtitle {
  color: #94a3b8;
  font-size: 1.15rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 2rem;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.category-card:hover {
  border-color: #4f46e5;
  transform: translateY(-10px);
  box-shadow: 0 20px 40px -10px rgba(79, 70, 229, 0.1);
}

.cat-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 2.5rem;
  transition: background 0.3s;
}

.category-card:hover .cat-icon-wrapper {
  background: rgba(79, 70, 229, 0.1);
}

.category-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1a1c21;
}
.cat-count {
  color: #4f46e5;
  font-weight: 700;
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.3s;
}
.category-card:hover .cat-count {
  opacity: 1;
}

/* --- Products Section --- */
.products-section {
  padding-bottom: 8rem;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.filter-tabs {
  background: #f1f5f9;
  padding: 0.4rem;
  border-radius: 1rem;
  display: flex;
  gap: 0.25rem;
}

.filter-tabs button {
  padding: 0.6rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  background: transparent;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tabs button.active {
  background: white;
  color: #1a1c21;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

/* --- Banner Section --- */
.banner-section {
  margin-bottom: 8rem;
}

.banner-card {
  background: #1a1c21;
  border-radius: 3rem;
  display: flex;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

.banner-content {
  flex: 1.2;
  padding: 6rem;
  color: white;
}
.banner-content h2 {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}
.banner-content p {
  font-size: 1.25rem;
  color: #94a3b8;
  margin-bottom: 3rem;
}

.subscribe-form {
  display: flex;
  gap: 1rem;
  max-width: 500px;
}

.subscribe-form input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  color: white;
  font-size: 1rem;
}

.subscribe-form button {
  background: white;
  color: #1a1c21;
  padding: 1.25rem 2rem;
  border-radius: 1rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.subscribe-form button:hover {
  background: #4f46e5;
  color: white;
}

.banner-image {
  flex: 0.8;
  height: 100%;
}
.banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- RTL Fixes --- */
[dir='rtl'] .hero-title {
  letter-spacing: 0;
}
[dir='rtl'] .btn-primary .arrow {
  transform: rotate(180deg);
}
[dir='rtl'] .feature-item:not(:last-child) {
  border-right: none;
  border-left: 1px solid #f1f5f9;
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-subtitle {
    margin-inline: auto;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-stats {
    justify-content: center;
  }
  .features-bar {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .feature-item {
    border: none !important;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
  .banner-card {
    flex-direction: column;
  }
  .banner-content {
    padding: 4rem 2rem;
    text-align: center;
  }
  .subscribe-form {
    flex-direction: column;
  }
}
</style>
