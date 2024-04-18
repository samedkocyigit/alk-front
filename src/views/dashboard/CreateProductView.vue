<template>
  <div class="max-lg:p-5 max-md:pt-10 relative flex flex-col w-full h-fit p-10 bg-[#fafafa] pt-10 rounded-[8px] py-5">
    <header class="max-md:flex-col flex gap-2 justify-between w-full border-b-2 pb-5">
      <div>
        <h1 class="text-2xl font-semibold">Create new product</h1>
        <BreadCrumb :routes="routes" />
      </div>
      <div class="flex gap-2">
        <AButton
          title="Cancel"
          type="cancel"
          class="w-fit h-fit py-2 px-3 bg-slate-200 text-primary-200"
          @click="onRegister"
        >
          <template #left>
            <i class="ri-close-line"></i>
          </template>
        </AButton>
        <AButton title="Create" class="w-fit h-fit py-2 px-3 text-white bg-blue-500" @click="onRegister">
          <template #left>
            <i class="ri-save-line"></i>
          </template>
        </AButton>
      </div>
    </header>
    <!-- body -->
    <div class="max-lg:flex-col flex w-full mt-5 gap-10 h-min">
      <!-- information -->
      <div class="max-md:px-4 flex-1 h-full bg-white p-7 border-[1px] rounded-2xl">
        <p class="text-lg font-medium mb-2">
          Basic information
          <span>
            <!-- icon -->
            <i class="ri-information-line"></i>
          </span>
        </p>
        <div class="flex flex-col w-full gap-6">
          <div class="w-full">
            <AInput v-model="name" name="name" is-required label="Product Name" placeholder="Enter name..." />
          </div>
          <div class="w-full">
            <AInput v-model="brand" name="brand" is-required label="Product Brand" placeholder="Enter Brand..." />
          </div>
          <div class="w-full">
            <AInput v-model="price" name="price" is-required label="Product Price" placeholder="Enter Price..." />
          </div>
          <div class="w-full">
            <AInput
              v-model="stock_code"
              name="stock_code"
              is-required
              label="Product Stock Code"
              placeholder="Enter Stock Code..."
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="manifuctorer_code"
              name="manifuctorer_code"
              is-required
              label="Product Manifuctorer Code"
              placeholder="Enter Manifuctorer Code..."
            />
          </div>
          <div class="w-full">
            <AInput v-model="summary" name="summary" label="Product Summary" placeholder="Enter Summary..." />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { ref } from 'vue'
import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import AButton from '@/components/commons/atoms/AButton.vue'
// import Quill from 'quill'
import '@/../public/css/quill.snow.css'
// import AFullLoading from '@/components/commons/atoms/AFullLoading.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
// services
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue3-toastify'
import { createProductApi } from '@/services/product.service'
// breadcrumb
const routes = ref([
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Create product',
    path: '/create-product',
  },
])

const onCreate = async (val) => {
  const { name, brand, price, stock_code, manifuctorer_code, summary } = val
  const data = {
    name: name,
    brand: brand,
    price: price,
    stock_code: stock_code,
    manifuctorer_code: manifuctorer_code,
    summary: summary,
  }
  // create product
  try {
    await createProductApi(data)
    toast.success('Register success!')
  } catch (error) {
    console.error('Registration error:', error)
    toast.error('Register failed!')
  }
}

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    brand: yup.string().required(),
    price: yup.number().required(),
    stock_code: yup.number().required(),
    manifuctorer_code: yup.string(),
    summary: yup.string().required(),
  }),
})

const onRegister = () => {
  handleSubmit(onCreate)()
}
</script>
<style scoped>
:deep(.ql-toolbar.ql-snow) {
  border: none !important;
  border-bottom: 1px solid #ebebeb !important;
  border-radius: 0 !important;
}
:deep(.ql-container.ql-snow) {
  border: none !important;
}
</style>
