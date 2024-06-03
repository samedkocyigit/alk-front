<template>
  <div class="flex border-[2px] rounded-md px-2 py-1">
    <input
      v-model="currentQuantity"
      class="py-0 border-none w-[40px]"
      style="outline: none"
      type="number"
      min="1"
      :max="maxQuantity"
      step="1"
      @input="updateQuantity"
    />
    <div class="flex gap-3">
      <!-- decrease btn -->
      <button class="bg-primary-300 rounded-sm w-6 h-full" @click="decreaseQuantity">-</button>
      <!-- increase btn -->
      <button class="bg-primary-300 rounded-sm w-6 h-full" @click="increaseAndAddToCart">+</button>
    </div>
  </div>
</template>

<script setup>
import { updateCartItemApi } from '@/services/cart.service'
import store from '@/stores/master.store'
import { ref, computed, defineProps, defineEmits } from 'vue'

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

const currentQuantity = computed({
  get() {
    return props.item ? props.item.quantity : quantity.value
  },
  set(value) {
    if (props.item) {
      props.item.quantity = value
    } else {
      quantity.value = value
    }
    emits('update:modelValue', value)
  },
})

const updateQuantity = (event) => {
  const newValue = parseInt(event.target.value)
  currentQuantity.value = isNaN(newValue) ? 1 : newValue
}

const increaseAndAddToCart = () => {
  if (props.item) {
    if (props.item.quantity >= 1) {
      addToCart(props.item.product._id)
    }
  } else {
    currentQuantity.value++
  }
}

const decreaseQuantity = () => {
  if (currentQuantity.value > 1) {
    if (props.item) {
      decreaseFromCart(props.item.product._id)
    } else {
      currentQuantity.value--
    }
  }
}

const decreaseFromCart = async (id) => {
  const res = await updateCartItemApi(store.state.cart._id, {
    items: [
      {
        product: id,
        quantity: -1,
      },
    ],
  })
  store.dispatch('updateCart', res.data.data.data)
}
const addToCart = async (id) => {
  const res = await updateCartItemApi(store.state.cart._id, {
    items: [{ product: id, quantity: 1 }],
  })
  store.dispatch('updateCart', res.data.data.data)
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
