<template>
  <div class="orders-view">
    <h1>Your Orders</h1>
    <div v-if="orders.length === 0">No orders found.</div>
    <div v-else>
      <div v-for="(order, index) in orders" :key="index" class="order">
        <h2>Order {{ index + 1 }}</h2>
        <p>Date: {{ formatDate(order.date) }}</p>
        <ul>
          <li v-for="(item, itemIndex) in order.cart.items" :key="itemIndex">
            {{ item.product.name }} - Quantity: {{ item.quantity }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import authStore from '@/stores/auth.store'

const orders = ref([])

// Her güncelleme olduğunda orders'i güncelle
const updateOrders = () => {
  orders.value = authStore.state.user.orders || []
  console.log('order', orders.value)
}
updateOrders()

// Tarih formatlama işlevi
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.orders-view {
  max-width: 800px;
  margin: 0 auto;
}

.order {
  margin-bottom: 20px;
}

.order h2 {
  margin-bottom: 5px;
}

.order ul {
  list-style-type: none;
  padding-left: 0;
}

.order li {
  margin-bottom: 5px;
}
</style>
