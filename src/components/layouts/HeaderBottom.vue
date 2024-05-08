<template>
  <header class="header-menu">
    <div class="container-xxl">
      <div class="header-bottom-inside">
        <div class="categories-wrapper" ref="categoriesWrapper">
          <div
            v-for="(category, index) in categories.data"
            :key="category._id"
            class="category-container"
            :ref="(categoryRef) => (categoryRefs[index] = categoryRef)"
            @mouseover="showSubcategories(index)"
            @mouseleave="hideSubcategories(index)"
          >
            <div class="category-item">
              <div class="category-name">
                <RouterLink :to="'/categories/' + category.slug">{{ category.category_name }}</RouterLink>
              </div>
            </div>
            <div
              class="subcategories-window"
              v-if="visibleCategoryIndex === index"
              :style="{ width: windowWidth + 'px', left: windowLeft + 'px' }"
            >
              <div v-for="subcategory in category.sub_category" :key="subcategory._id" class="subcategories-container">
                <RouterLink :to="'/categories/' + category.slug + '/sub_category/' + subcategory.slug">
                  <div class="subcategory-card">
                    <div class="subcategory-name">
                      {{ subcategory.sub_category_name }}
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import store from '@/stores/master.store'

const categories = ref(store.state.categories)
const visibleCategoryIndex = ref(-1)
const windowWidth = ref(1420)
const windowLeft = ref(0)

// Kategori referans noktaları
const categoryRefs = ref([])

const showSubcategories = (index) => {
  visibleCategoryIndex.value = index

  // Kategori referans noktasının sol koordinatını al
  const categoryRect = categoryRefs.value[index].getBoundingClientRect()
  const wrapperRect = categoryRefs.value[0].parentElement.getBoundingClientRect()

  // windowLeft değerini kategori referans noktasının sol koordinatı olarak ayarla
  windowLeft.value = wrapperRect.left - categoryRect.left
}

const hideSubcategories = () => {
  visibleCategoryIndex.value = -1
}
</script>

<style scoped>
.header-menu {
  height: 65px;
  width: 100%;
  background-color: #5a4098;
  text-align: center;
}

.container-xxl {
  max-width: 1500px;
  margin: 0 auto;
}

.header-bottom-inside {
  display: flex;
  justify-content: center;
}

.categories-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.category-container {
  position: relative;
  height: 65px;
  width: 100px;
  max-width: 150px;
  margin-right: 20px;
  text-align: center;
  align-items: center;
  display: flex;
  transition: background-color 0.3s ease;
  color: white;
}

.category-container:hover {
  background-color: white;
  color: black;
}

.category-name {
  position: relative;
}

.category-name:hover {
  color: rgb(0, 0, 0);
}

.subcategories-window {
  position: absolute;
  top: 100%;
  background-color: white;
  border: 1px solid #ccc;
}

.subcategories-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 5px;
  display: inline-block;
}

.subcategory-card {
  width: 150px;
  height: 220px;
  background-color: #f1f1f1;
  border-radius: 5px;
  border: 1px solid #ccc; /* Kartın etrafında ince bir border oluştur */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  float: left; /* Kartları sola yatık şekilde hizala */
}
.subcategory-card:hover {
  border-color: #f90; /* Hover durumunda farklı bir renk kullanabilirsiniz */
}

.subcategory-name {
  padding: 10px;
}
</style>
