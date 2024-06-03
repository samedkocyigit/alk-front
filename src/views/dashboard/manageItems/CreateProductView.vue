<script setup>
import { computed, ref, watch } from 'vue'
import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import AButton from '@/components/commons/atoms/AButton.vue'
import ADropdown from '@/components/commons/atoms/ADropdown.vue'
import '@@/css/quill.snow.css'
import AFullLoading from '@/components/commons/atoms/AFullLoading.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
// services
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue3-toastify'
import { createProductApi } from '@/services/product.service'
import store from '@/stores/master.store'

let base64String = ref(null)
const errorMessage = ref('')
const fileInput = ref(null)
const isCreating = ref(false)
const totalImageUploaded = ref({
  success: 0,
  error: 0,
})
const categories = computed(() => store.state.categories)
const categoryOptions = computed(() => {
  return categories.value.data.map((category) => ({
    id: category._id,
    label: category.category_name,
    subCategory: category.sub_category,
  }))
})

const selectedCategory = ref(null)
const subCategoryOptions = ref([])
const selectedSubCategory = ref(null)
const selectedBrand = ref(null)

const brands = computed(() => store.state.brands)
const brandOptions = computed(() => {
  return brands.value.data.map((brand) => ({
    id: brand._id,
    label: brand.name,
  }))
})

watch(selectedCategory, (newValue) => {
  const selectedCategoryObj = categoryOptions.value.find((category) => category.id === newValue)
  if (selectedCategoryObj) {
    subCategoryOptions.value = selectedCategoryObj.subCategory.map((subCategory) => ({
      id: subCategory._id,
      label: subCategory.sub_category_name,
    }))
  } else {
    subCategoryOptions.value = []
  }
})

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

const handleFileChange = () => {
  if (fileInput.value.files.length > 0) {
    const file = fileInput.value.files[0]
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Dosya boyutu çok büyük'
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      base64String.value = reader.result
    }
  }
}

const { handleSubmit, values } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    price: yup.number().required(),
    stock_code: yup.number().required(),
    manufacturer_code: yup.string(),
    summary: yup.string().required(),
  }),
})

const onCreate = async () => {
  console.log('Attributes:', attributes.value)
  const { name, price, stock_code, manufacturer_code, summary } = values
  const ozelliklerData = attributes.value.map((attribute) => ({
    name: attribute.name,
    value: attribute.value,
  }))

  const data = {
    name: name,
    brand: selectedBrand.value,
    price: price,
    stock_code: stock_code,
    manufacturer_code: manufacturer_code,
    summary: summary,
    categoryId: selectedCategory.value,
    subCategoryId: selectedSubCategory.value,
    photos: base64String.value,
    ozellikler: ozelliklerData,
  }

  isCreating.value = true
  try {
    await createProductApi(data)
    toast.success('Register success!')
  } catch (error) {
    console.error('Registration error:', error)
    toast.error('Register failed!')
  } finally {
    isCreating.value = false
  }
}

const onRegister = handleSubmit(onCreate)

const attributes = ref([
  {
    name: '',
    value: '',
  },
])

const addAttribute = () => {
  attributes.value.push({
    name: '',
    value: '',
  })
}

const removeAttribute = (index) => {
  attributes.value.splice(index, 1)
}
</script>

<template>
  <AFullLoading v-show="isCreating">
    <template #content>
      <p class="text-lg">Creating product...</p>
    </template>
  </AFullLoading>
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
    <div class="max-lg:flex-col flex w-full mt-5 gap-10 h-min">
      <div class="max-md:px-4 flex-1 h-full bg-white p-7 border-[1px] rounded-2xl">
        <p class="text-lg font-medium mb-2">
          Basic information
          <span>
            <i class="ri-information-line"></i>
          </span>
        </p>
        <div class="flex flex-col w-full gap-6">
          <div class="w-full">
            <AInput v-model="values.name" name="name" is-required label="Product Name" placeholder="Enter name..." />
          </div>
          <div class="w-full">
            <ADropdown
              v-model="selectedBrand"
              class="w-full h-full"
              is-required="true"
              label="Brand"
              :options="brandOptions"
              placeholder="Select brand..."
              required
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="values.price"
              name="price"
              is-required
              label="Product Price"
              placeholder="Enter Price..."
            />
          </div>
          <div class="max-lg:flex-wrap flex gap-2">
            <ADropdown
              v-model="selectedCategory"
              class="w-full h-full"
              label="Category"
              :options="categoryOptions"
              placeholder="Select category..."
            />
            <ADropdown
              v-model="selectedSubCategory"
              class="w-full h-full"
              label="Subcategory"
              :options="subCategoryOptions"
              placeholder="Select subcategory..."
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="values.stock_code"
              name="stock_code"
              is-required
              label="Product Stock Code"
              placeholder="Enter Stock Code..."
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="values.manufacturer_code"
              name="manufacturer_code"
              is-required
              label="Product Manufacturer Code"
              placeholder="Enter Manufacturer Code..."
            />
          </div>
          <div class="w-full">
            <AInput v-model="values.summary" name="summary" label="Product Summary" placeholder="Enter Summary..." />
          </div>
          <!-- Attributes Section -->
          <div class="w-full">
            <p class="text-lg font-medium mb-2">Attributes</p>
            <div v-for="(attribute, index) in attributes" :key="index" class="flex flex-col gap-2">
              <input
                v-model="attribute.name"
                placeholder="Attribute Name"
                class="w-full h-10 px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                v-model="attribute.value"
                placeholder="Attribute Value"
                class="w-full h-10 px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button @click="removeAttribute(index)" class="mt-2 py-1 px-3 bg-red-500 text-white rounded-md">
                Remove Attribute
              </button>
            </div>
            <button @click="addAttribute" class="mt-2 py-1 px-3 bg-blue-500 text-white rounded-md">
              Add Attribute
            </button>
          </div>

          <!-- End Attributes Section -->
        </div>
      </div>
      <div>
        <input type="file" ref="fileInput" @change="handleFileChange" />
      </div>
    </div>
  </div>
</template>

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
