<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    title: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
}
</script>
