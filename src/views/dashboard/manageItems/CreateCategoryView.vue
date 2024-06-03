<script setup>
import { ref, computed } from 'vue'
import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import AButton from '@/components/commons/atoms/AButton.vue'
import '@@/css/quill.snow.css'
import AFullLoading from '@/components/commons/atoms/AFullLoading.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
import ADropdown from '@/components/commons/atoms/ADropdown.vue'
// services
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue3-toastify'
import store from '@/stores/master.store'
import { createSubCategoryApi, createCategoryApi } from '@/services/category.service'

// breadcrumb
const selectedCategory = ref(null)

const categories = computed(() => store.state.categories)
const categoryOptions = computed(() => {
  return categories.value.data.map((category) => ({
    id: category._id,
    label: category.category_name,
  }))
})

const routes = ref([
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Create category',
    path: '/create-category',
  },
])

const handleFileChangeCategory = () => {
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
      base64StringCategory.value = reader.result // Base64 formatındaki veri
    }
  }
}

const onCreateCategory = async (val) => {
  console.log('valll', val)
  const { category_name, sub_category_name } = val
  const data = {
    category_name: category_name,
    photos: base64StringCategory.value,
    sub_category: [
      {
        sub_category_name: sub_category_name,
        photos: base64StringSubCategory.value,
      },
    ],
  }
  // create product
  try {
    await createCategoryApi(data)
    toast.success('Creation success!')
  } catch (error) {
    console.error('Creation error:', error)
    toast.error('Creation failed!')
  }
}

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    category_name: yup.string().required(),
    sub_category_name: yup.string().required(),
  }),
})

const onRegisterCategory = () => {
  handleSubmit(onCreateCategory)()
}
const handleFileChangeSubCategory = () => {
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
      base64StringSubCategory.value = reader.result // Base64 formatındaki veri
    }
  }
}

const onCreateSubCategory = async (val) => {
  const { sub_category_name } = val
  const data = {
    sub_category_name: sub_category_name,
    photos: base64StringSubCategory.value,
  }
  console.log('valvalval', data, selectedCategory.value)
  // create product
  try {
    await createSubCategoryApi(selectedCategory.value, data)
    toast.success('Creation success!')
  } catch (error) {
    console.error('Creation error:', error)
    toast.error('Creation failed!')
  }
}

const { handleSubmit: handleSubCategory } = useForm({
  validationSchema: yup.object({
    sub_category_name: yup.string().required(),
  }),
})

const onRegisterSubCategory = () => {
  handleSubCategory((values) => {
    onCreateSubCategory(values)
  })()
}

let base64StringCategory = ref(null)
let base64StringSubCategory = ref(null)
const errorMessage = ref('')
const fileInput = ref(null)
const isCreating = ref(false)
const totalImageUploaded = ref({
  success: 0,
  error: 0,
})
</script>

<template>
  <AFullLoading v-show="isCreating">
    <template #content>
      <p class="text-lg">Creating Brand...</p>
    </template>
  </AFullLoading>
  <div class="max-lg:p-5 max-md:pt-10 relative flex flex-col w-full h-fit p-10 bg-[#fafafa] pt-10 rounded-[8px] py-5">
    <!-- header -->
    <header class="max-md:flex-col flex gap-2 justify-between w-full border-b-2 pb-5">
      <div>
        <h1 class="text-2xl font-semibold">Yeni Kategori Oluştur</h1>
        <BreadCrumb :routes="routes" />
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
          <div class="flex-1">
            <div class="max-md:w-full">
              <AInput
                v-model="category_name"
                name="category_name"
                is-required
                label="Kategori Adı"
                placeholder="Enter name..."
              />
            </div>
          </div>
          <div class="flex-1">
            <div class="flex flex-col gap-0 w-full">
              <p class="font-medium text-gray-700 text-base mb-2">
                Kategori Fotoğrafı<span class="text-rose-600">*</span>
              </p>
              <input type="file" ref="fileInput" @change="handleFileChangeCategory" />
            </div>
          </div>
          <div class="flex flex-col w-full gap-6">
            <div class="flex-1">
              <div class="max-md:w-full">
                <AInput
                  v-model="sub_category_name"
                  name="sub_categoryName"
                  is-required
                  label="Alt Kategori Adı"
                  placeholder="Enter name..."
                />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex flex-col gap-0 w-full">
                <p class="font-medium text-gray-700 text-base mb-2">
                  Alt Kategori Fotoğrafı<span class="text-rose-600">*</span>
                </p>
                <input type="file" ref="fileInput" @change="handleFileChangeSubCategory" />
              </div>
            </div>
            <div class="flex gap-2">
              <AButton title="Create" class="w-fit h-fit py-2 px-3 text-white bg-blue-500" @click="onRegisterCategory">
                <template #left>
                  <i class="ri-save-line"></i>
                </template>
              </AButton>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 h-full bg-white p-7 border-[1px] rounded-2xl">
        <div class="w-full">
          <p class="text-lg font-medium mb-2">
            Alt Kategoriler
            <span>
              <i class="ri-information-line"></i>
            </span>
          </p>
          <div class="flex flex-col w-full gap-6">
            <ADropdown
              v-model="selectedCategory"
              class="w-full h-full"
              is-required="true"
              label="Kategoriler"
              :options="categoryOptions"
              placeholder="Select category..."
              required
            />
            <div class="flex flex-col md:flex-row w-full gap-6">
              <div class="flex-1">
                <div class="max-md:w-full">
                  <AInput
                    v-model="sub_category_name"
                    name="sub_category_name"
                    is-required
                    label="Alt Kategori Adı"
                    placeholder="Enter name..."
                  />
                </div>
              </div>
              <div class="flex-1">
                <div class="flex flex-col gap-0 w-full">
                  <p class="font-medium text-gray-700 text-base mb-2">
                    Alt Kategori Fotoğrafı<span class="text-rose-600">*</span>
                  </p>
                  <input type="file" ref="fileInput" @change="handleFileChangeSubCategory" />
                </div>
              </div>
              <div class="flex gap-2">
                <AButton
                  title="Create"
                  class="w-fit h-fit py-2 px-3 text-white bg-blue-500"
                  @click="onRegisterSubCategory"
                >
                  <template #left>
                    <i class="ri-save-line"></i>
                  </template>
                </AButton>
              </div>
            </div>
          </div>
        </div>
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
