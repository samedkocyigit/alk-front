<template>
  <img v-show="src && isLoaded" :id="id" :alt="alt" :class="classStyle" :src="src" @load="onLoaded" />
  <img v-show="!src || !isLoaded" :id="id" :alt="alt" :class="classStyle" src="@@/images/1.jpg" />
</template>
<script setup>
import { ref } from 'vue'
const isLoaded = ref(false)
defineProps({
  src: {
    type: String,
    required: false,
    default: '',
  },
  classStyle: {
    type: String,
    required: false,
    default: '',
  },
  id: {
    type: String,
    required: false,
    default: '',
  },
  alt: {
    type: String,
    required: false,
    default: '',
  },
})
const onLoaded = () => {
  isLoaded.value = true
}
</script>
