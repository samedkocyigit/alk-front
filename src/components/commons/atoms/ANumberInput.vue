<!-- ANumberInput.vue -->
<template>
  <div class="flex border-[2px] rounded-md px-2 py-1">
    <input
      v-model="quantity"
      class="py-0 border-none w-[40px]"
      style="outline: none"
      type="number"
      min="1"
      :max="maxQuantity"
      step="1"
      @input="updateQuantity"
    />
    <div class="flex gap-2">
      <!-- decrease btn -->
      <button class="bg-primary-300 rounded-sm w-6 h-full" @click="decreaseQuantity">-</button>
      <!-- increase btn -->
      <button class="bg-primary-300 rounded-sm w-6 h-full" @click="increaseAndAddToCart">+</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  maxQuantity: {
    type: Number,
    default: 9,
  },
  item: {
    type: Object,
    default: null,
  },
  initialValue: {
    type: Number,
    default: 1,
  },
})

const emits = defineEmits(['update:modelValue'])

const quantity = ref(props.initialValue)

const updateQuantity = (event) => {
  const newValue = parseInt(event.target.value)
  quantity.value = isNaN(newValue) ? 1 : newValue
  emits('update:modelValue', quantity.value)
}

const increaseAndAddToCart = () => {
  if (props.item) {
    // Eğer item varsa, addToCart fonksiyonunu çağır
    addToCart()
  } else {
    // Eğer item yoksa, sadece quantity değerini artır
    quantity.value++
    emits('update:modelValue', quantity.value)
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
    emits('update:modelValue', quantity.value)
  }
}

const addToCart = () => {
  // Burada item bilgisini kullanarak addToCart fonksiyonunu çağırabilirsiniz
}
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* disable border on focus */
input[type='number'] {
  border: none !important;
}
input[type='number']:focus {
  outline: none;
}
</style>
