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
// breadcrumb

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

watch(selectedCategory, (newValue, oldValue) => {
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
      errorMessage.value = 'Dosya boyutu çok büyük' // Hata mesajı gösterilebilir
      return // Fonksiyondan çık
    }
    // Dosya boyutu uygunsa devam et
    const reader = new FileReader()
    reader.readAsDataURL(file) // Dosyayı base64 formatına çevir
    reader.onload = () => {
      base64String.value = reader.result // Base64 formatındaki veri
    }
  }
}

const onCreate = async (val) => {
  console.log('val', val)
  const { name, brand, price, stock_code, manifuctorer_code, summary } = val

  const data = {
    name: name,
    brand: selectedBrand.value,
    price: price,
    stock_code: stock_code,
    manifuctorer_code: manifuctorer_code,
    summary: summary,
    categoryId: selectedCategory.value,
    subCategoryId: selectedSubCategory.value,
    photos: base64String.value,
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
    // brand: yup.string().required(),
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

<template>
  <AFullLoading v-show="isCreating">
    <template #content>
      <!-- <p v-if="totalImageUploaded.success !== files.length" class="text-lg">
        Uploading image... {{ totalImageUploaded.success }}/{{ files.length }}
      </p> -->
      <p class="text-lg">Creating product...</p>
    </template>
  </AFullLoading>
  <!-- <div class="flex w-full px-5 pt-7 pb-10 justify-center gap-5"> -->
  <div class="max-lg:p-5 max-md:pt-10 relative flex flex-col w-full h-fit p-10 bg-[#fafafa] pt-10 rounded-[8px] py-5">
    <!-- <div class="absolute backdrop-blur w-full h-full flex justify-center top-0 left-0 z-10 pt-14">
      <div class="p-7 h-fit bg-white gb-shadow rounded-3xl flex flex-col justify-center items-center">
        <p class="text-lg font-semibold">Please confirm your email to create product</p>
        <p class="text-sm text-primary-200">We have sent you an email to confirm your email</p>
        <p class="text-sm text-primary-200">If you don't see the email, please check your spam folder</p>
        <p class="text-sm text-primary-200">If you still don't see the email, please contact us</p>
        <AButton title="Resend email" class="mt-5 w-fit text-white bg-blue-500">
          <template #left>
            <i class="ri-mail-send-line mr-2"></i>
          </template>
        </AButton>
      </div>
    </div> -->
    <!-- header -->
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
            <ADropdown
              v-model="selectedBrand"
              class="w-full h-full"
              is-required="true"
              label="Brand"
              :options="brandOptions"
              placeholder="Select category..."
              required
            />
          </div>
          <div class="w-full">
            <AInput v-model="price" name="price" is-required label="Product Price" placeholder="Enter Price..." />
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
        <!-- image by type -->
      </div>
      <!-- end upload -->
      <!-- image upload -->
      <div>
        <input type="file" ref="fileInput" @change="handleFileChange" />
      </div>
    </div>
  </div>
  <!-- </div> -->
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
