<template>
  <div class="product-info">
    <p class="summary">{{ product.data.summary }}</p>
    <div class="features">
      <ul class="features-list">
        <li class="feature-item">
          <span class="feature-name">Ürün Kategorisi:</span> <span class="feature-value">{{ categoryName }}</span>
        </li>
        <li v-for="feature in product.data.ozellikler" :key="feature.id" class="feature-item">
          <span class="feature-name">{{ feature.name }}:</span> <span class="feature-value">{{ feature.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getCategoryApi } from '@/services/category.service'

export default {
  props: ['product'],
  data() {
    return {
      categoryName: '',
    }
  },
  async created() {
    try {
      console.log(this.product)
      const category = await getCategoryApi(this.product.data.categoryId)
      console.log(category)
      this.categoryName = category.data.data.data.category_name
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  },
}
</script>

<style scoped>
.product-info {
  margin-top: 20px;
}

.summary {
  margin-bottom: 20px;
  font-size: 16px;
}

.features {
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.features-title {
  font-size: 18px;
  margin-bottom: 10px;
}

.features-list {
  list-style-type: none;
  padding: 0;
}

.feature-item {
  margin-bottom: 10px;
}

.feature-name {
  font-weight: bold;
  margin-right: 5px;
}

.feature-value {
  color: #666;
}
</style>
