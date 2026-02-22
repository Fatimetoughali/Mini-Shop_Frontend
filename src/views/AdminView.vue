<script setup>
import { ref, onMounted, reactive } from 'vue'
import { productApi, orderApi, categoryApi } from '@/services/api'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const currentTab = ref('products') // 'products', 'orders', 'categories'
const products = ref([])
const orders = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref(null)
const showModal = ref(false)
const modalMode = ref('add') // 'add' or 'edit'
const modalTarget = ref('product') // 'product' or 'category'

const formData = reactive({
  id: null,
  name: '',
  description: '',
  price: '',
  image: '',
  category_id: '',
  stock: 100,
})

const catFormData = reactive({
  id: null,
  name: '',
  icon: '',
})

const imageFile = ref(null)

const getImageUrl = (product) => {
  if (product.image_url) return product.image_url
  const imagePath = product.image
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  const cleanPath = imagePath.replace(/^storage\//, '')
  let apiBase = import.meta.env.VITE_API_URL || 'https://morning-escarpment-60598-854031287859.herokuapp.com/api'
  apiBase = apiBase.replace(/\/api$/, '')
  return `${apiBase}/api/images/${cleanPath}`
}

const fetchProducts = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await productApi.getAll()
    products.value = Array.isArray(response.data) ? response.data : response.data.data || []
  } catch (err) {
    console.error(err)
    error.value = t('admin.errorProducts')
  } finally {
    loading.value = false
  }
}

const fetchOrders = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await orderApi.getAllAdmin()
    orders.value = Array.isArray(response.data) ? response.data : response.data.data || []
  } catch (err) {
    console.error(err)
    error.value = t('admin.errorOrders')
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await categoryApi.getAll()
    categories.value = response.data
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors du chargement des catégories'
  } finally {
    loading.value = false
  }
}

const switchTab = (tab) => {
  currentTab.value = tab
  if (tab === 'products') fetchProducts()
  else if (tab === 'orders') fetchOrders()
  else if (tab === 'categories') fetchCategories()
}

const openAddModal = (target = 'product') => {
  modalTarget.value = target
  modalMode.value = 'add'
  if (target === 'product') {
    formData.id = null
    formData.name = ''
    formData.description = ''
    formData.price = ''
    formData.image = ''
    formData.category_id = ''
    formData.stock = 100
    imageFile.value = null
  } else {
    catFormData.id = null
    catFormData.name = ''
    catFormData.icon = ''
  }
  showModal.value = true
}

const openEditModal = (item, target = 'product') => {
  modalTarget.value = target
  modalMode.value = 'edit'
  if (target === 'product') {
    formData.id = item.id
    formData.name = item.name
    formData.description = item.description
    formData.price = item.price
    formData.image = item.image
    formData.category_id = item.category_id || ''
    formData.stock = item.stock || 0
    imageFile.value = null
  } else {
    catFormData.id = item.id
    catFormData.name = item.name
    catFormData.icon = item.icon || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (modalTarget.value === 'product') {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', parseFloat(formData.price))
      formDataToSend.append('category_id', parseInt(formData.category_id) || 1)
      formDataToSend.append('stock', parseInt(formData.stock) || 0)

      if (imageFile.value) {
        formDataToSend.append('image', imageFile.value)
      }

      if (modalMode.value === 'add') {
        await productApi.create(formDataToSend)
      } else {
        formDataToSend.append('_method', 'PUT')
        await productApi.update(formData.id, formDataToSend)
      }
      await fetchProducts()
    } else {
      if (modalMode.value === 'add') {
        await categoryApi.create({ name: catFormData.name, icon: catFormData.icon })
      } else {
        await categoryApi.update(catFormData.id, { name: catFormData.name, icon: catFormData.icon })
      }
      await fetchCategories()
    }
    closeModal()
  } catch (err) {
    console.error('Submit Error:', err)
    alert("Erreur lors de l'enregistrement.")
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id, target = 'product') => {
  if (!confirm(t('admin.confirmDelete'))) return
  loading.value = true
  try {
    if (target === 'product') {
      await productApi.delete(id)
      await fetchProducts()
    } else {
      await categoryApi.delete(id)
      await fetchCategories()
    }
  } catch {
    alert('Erreur lors de la suppression.')
  } finally {
    loading.value = false
  }
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    paid: 'Payé',
    shipped: 'Expédié',
    completed: 'Terminé',
    cancelled: 'Annulé',
  }
  return labels[status] || status
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getPaymentLabel = (method) => {
  const labels = {
    cash: 'Cash',
    bankily: 'Bankily',
    sedad: 'Sedad',
    masrvi: 'Masrvi',
    gazapay: 'GazaPay',
  }
  return labels[method] || method
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<template>
  <div class="admin-view container">
    <div class="header-row">
      <h1>{{ t('admin.title') }}</h1>
      <div class="tabs">
        <button
          @click="switchTab('products')"
          :class="['tab-btn', { active: currentTab === 'products' }]"
        >
          {{ t('admin.products') }}
        </button>
        <button
          @click="switchTab('categories')"
          :class="['tab-btn', { active: currentTab === 'categories' }]"
        >
          {{ t('admin.categories') }}
        </button>
        <button
          @click="switchTab('orders')"
          :class="['tab-btn', { active: currentTab === 'orders' }]"
        >
          {{ t('admin.orders') }}
        </button>
      </div>
      <button v-if="currentTab === 'products'" @click="openAddModal('product')" class="add-btn">
        + {{ t('admin.newProduct') }}
      </button>
      <button v-if="currentTab === 'categories'" @click="openAddModal('category')" class="add-btn">
        + {{ t('admin.newCategory') }}
      </button>
    </div>

    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    <div v-if="error" class="error-msg">{{ error }}</div>

    <div v-else class="table-container">
      <!-- Table Produits -->
      <table v-if="currentTab === 'products'" class="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>{{ t('admin.productName') }}</th>
            <th>Catégorie</th>
            <th>{{ t('admin.price') }}</th>
            <th>{{ t('admin.stock') }}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <img
                :src="getImageUrl(product)"
                alt="Product"
                class="thumb"
                @error="
                  (e) =>
                    (e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3E?%3C/text%3E%3C/svg%3E')
                "
              />
            </td>
            <td>{{ product.name }}</td>
            <td>
              <span class="cat-badge">{{ product.category?.name || '---' }}</span>
            </td>
            <td>{{ product.price }} MRU</td>
            <td>
              <span :class="['stock-badge', { low: (product.stock || 0) < 10 }]">
                {{ product.stock || 0 }}
              </span>
            </td>
            <td class="actions">
              <button @click="openEditModal(product, 'product')" class="edit-btn">
                {{ t('common.edit') }}
              </button>
              <button @click="handleDelete(product.id, 'product')" class="delete-btn">
                {{ t('common.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Table Catégories -->
      <table v-else-if="currentTab === 'categories'" class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{{ locale === 'ar' ? 'الاسم' : 'Nom' }}</th>
            <th>Icône</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td>#{{ cat.id }}</td>
            <td>{{ cat.name }}</td>
            <td style="font-size: 1.5rem">{{ cat.icon || '📦' }}</td>
            <td class="actions">
              <button @click="openEditModal(cat, 'category')" class="edit-btn">
                {{ t('common.edit') }}
              </button>
              <button @click="handleDelete(cat.id, 'category')" class="delete-btn">
                {{ t('common.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Table Commandes -->
      <table v-else-if="currentTab === 'orders'" class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Total</th>
            <th>Paiement</th>
            <th>Date</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>
              <div class="user-info">
                <strong>{{ order.user?.name || 'Inconnu' }}</strong>
                <small>{{ order.user?.email }}</small>
                <small v-if="order.phone_number">{{ order.phone_number }}</small>
              </div>
            </td>
            <td>{{ order.total_price }} MRU</td>
            <td>{{ getPaymentLabel(order.payment_method) }}</td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Uni (Produit ou Catégorie) -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>
          {{
            modalTarget === 'product'
              ? modalMode === 'add'
                ? t('admin.newProduct')
                : 'Modifier le produit'
              : modalMode === 'add'
                ? t('admin.newCategory')
                : 'Modifier la catégorie'
          }}
        </h2>

        <form @submit.prevent="handleSubmit" class="product-form">
          <template v-if="modalTarget === 'product'">
            <div class="form-group">
              <label>{{ t('admin.productName') }}</label>
              <input v-model="formData.name" type="text" required />
            </div>

            <div class="form-group">
              <label>{{ t('admin.description') }}</label>
              <textarea v-model="formData.description" required></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('admin.price') }} (MRU)</label>
              <input v-model="formData.price" type="number" required />
            </div>

            <div class="form-group">
              <label>{{ t('admin.categories') }}</label>
              <select v-model="formData.category_id" required>
                <option value="" disabled>Sélectionner une catégorie</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Image du produit</label>
              <input
                type="file"
                @change="handleFileChange"
                accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
              />
            </div>

            <div class="form-group">
              <label>{{ t('admin.stock') }}</label>
              <input v-model="formData.stock" type="number" required />
            </div>
          </template>

          <template v-else>
            <div class="form-group">
              <label>{{ t('admin.categoryName') }}</label>
              <input v-model="catFormData.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Icône (Emoji ou texte)</label>
              <input v-model="catFormData.icon" type="text" placeholder="Ex: 📱, 👕, 🏠" />
            </div>
          </template>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              {{ t('common.cancel') }}
            </button>
            <button type="submit" class="save-btn">{{ t('common.save') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-view {
  padding: 2rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.4rem;
  font-weight: 500;
  transition: all 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
}

.tab-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.add-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.admin-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #64748b;
}

.thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info small {
  color: #64748b;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.paid {
  background: #dcfce7;
  color: #166534;
}
.status-badge.shipped {
  background: #dbeafe;
  color: #1e40af;
}

.cat-badge {
  background: #f1f5f9;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #475569;
}

.stock-badge {
  padding: 0.25rem 0.5rem;
  background: #f1f5f9;
  border-radius: 0.25rem;
}

.stock-badge.low {
  background: #fee2e2;
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  color: #3b82f6;
  background: #e0e7ff;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

.delete-btn {
  color: #ef4444;
  background: #fee2e2;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.save-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background: #f1f5f9;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}

.error-msg {
  color: #ef4444;
  padding: 1rem;
  background: #fee2e2;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

/* RTL Support for Admin View */
[dir='rtl'] .header-row {
  flex-direction: row-reverse;
}

[dir='rtl'] .admin-table th,
[dir='rtl'] .admin-table td {
  text-align: right;
}

[dir='rtl'] .modal-actions {
  justify-content: flex-start;
}
</style>
