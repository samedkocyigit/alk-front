<script setup>
import { useField } from 'vee-validate'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  isPassword: {
    type: Boolean,
    default: false,
  },
  styleCustom: {
    type: String,
    default: ' border-[2px] border-[#ebebeb]',
  },
  name: {
    type: String,
    default: '',
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  options: {
    type: Array,
    default: () => [],
  },
})

const { value, errorMessage } = useField(() => props.name)

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex flex-col gap-0 w-full">
    <p class="font-medium text-gray-700 text-base mb-2">
      {{ label }} <span v-if="isRequired" class="text-rose-600">*</span>
    </p>
    <div v-if="type === 'radio'" class="flex flex-row space-x-6">
      <div v-for="(option, index) in options" :key="index" class="flex items-center">
        <input type="radio" :value="option.value" :id="`${name}-${index}`" :name="name" v-model="value" class="mr-2" />
        <label :for="`${name}-${index}`">{{ option.label }}</label>
      </div>
    </div>
    <input
      v-else
      v-model="value"
      :class="styleCustom"
      class="w-full rounded-md"
      :type="isPassword && showPassword ? 'text' : type"
      :placeholder="placeholder"
      :name="name"
    />
    <div class="w-full flex mt-2 items-center">
      <p class="text-rose-600 text-sm font-medium">
        <i v-if="errorMessage" class="ri-error-warning-fill mr-1"></i>{{ errorMessage }}
      </p>
    </div>
  </div>
</template>
