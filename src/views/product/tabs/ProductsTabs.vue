<template>
  <div class="tabs">
    <!-- Sekme Başlıkları -->
    <div class="tab-headers">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: activeTab === index }"
        @click="selectTab(index)"
        class="tab-header"
      >
        {{ tab.title }}
      </div>
    </div>

    <!-- Sekme İçerikleri -->
    <div class="tab-contents">
      <component
        v-for="(tab, index) in tabs"
        :is="tab.component"
        :key="index"
        v-show="activeTab === index"
        v-bind="tab.props"
      />
    </div>
  </div>
</template>

<script>
import ProductInfo from './ProductInfo.vue'
import Reviews from './Reviews.vue'
import InstallmentOptions from './InstallmentOptions.vue'
import Recommendations from './Recommendations.vue'

export default {
  components: { ProductInfo, Reviews, InstallmentOptions, Recommendations },
  data() {
    return {
      activeTab: 0,
      tabs: [
        { title: 'Ürün Bilgisi', component: 'ProductInfo', props: { productInfo: 'Burada ürün bilgisi olacak' } },
        { title: 'Yorumlar', component: 'Reviews', props: { reviews: 'Burada yorumlar olacak' } },
        {
          title: 'Taksit Seçenekleri',
          component: 'InstallmentOptions',
          props: { installmentOptions: 'Burada taksit seçenekleri olacak' },
        },
        {
          title: 'Önerileriniz',
          component: 'Recommendations',
          props: { recommendations: 'Burada önerileriniz olacak' },
        },
      ],
    }
  },
  methods: {
    selectTab(index) {
      this.activeTab = index
    },
  },
}
</script>

<style scoped>
.tab-headers {
  display: flex;
  justify-content: center; /* Başlıkları yatayda ortala */
}

.tab-header {
  display: inline-block; /* Başlıkları yatayda hizala */
  padding: 15px 20px;
  cursor: pointer;
  background-color: #f5f5f5;
  transition: background-color 0.3s, color 0.3s;
}

.tab-header:hover {
  background-color: #e0e0e0;
}

.tab-header.active {
  background-color: #fff;
  color: #000;
  font-weight: bold;
  border-radius: 8px;
}

.tab-contents > :not(:last-child) {
  margin-bottom: 20px;
}
</style>
