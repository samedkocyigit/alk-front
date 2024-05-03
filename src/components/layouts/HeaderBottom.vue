<template>
  <header class="header-menu">
    <div class="container-xxl">
      <div class="header-bottom-inside">
        <div class="categories-wrapper">
          <!-- Döngüyü içeren div -->
          <div v-for="category in categories" :key="category._id" class="category-container">
            <div class="category-item">
              <div class="category-name" @mouseover="showSubcategories(category)" @mouseleave="hideSubcategories">
                <RouterLink :to="'/categories/' + category.slug">{{ category.category_name }}</RouterLink>
              </div>
              <ul class="subcategories" v-if="showSubCategory === category._id">
                <li v-for="subcategory in category.sub_category" :key="subcategory._id" class="subcategory-item">
                  {{ subcategory.name }}
                </li>
              </ul>
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

const categories = ref(store.state.categories.data)
const showSubCategory = ref(null)

const showSubcategories = (category) => {
  showSubCategory.value = category._id
}

const hideSubcategories = () => {
  showSubCategory.value = null
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
  max-width: 1500px; /* İstediğiniz maksimum genişlik */
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
  height: 65px;
  width: 100px;
  max-width: 150px; /* Maksimum genişlik */
  margin-right: 20px; /* İstediğiniz aralık */
  text-align: center;
  align-items: center;
  display: flex;
  transition: background-color 0.3s ease;
  color: white;
  position: relative;
}

.category-container:hover {
  background-color: white;
  color: black;
}

.category-item {
  position: relative;
}

.category-name {
  position: relative;
}

.category-name:hover {
  color: rgb(0, 0, 0);
}

.subcategories {
  position: absolute;
  top: 100%;
  left: 0;
  display: none;
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px;
}

.subcategory-item {
  color: rgb(196, 8, 8);
}
</style>
