<script setup>
import { ref } from 'vue'
import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import AButton from '@/components/commons/atoms/AButton.vue'
import '@@/css/quill.snow.css'
import AFullLoading from '@/components/commons/atoms/AFullLoading.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
// services
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue3-toastify'
import { createBrandApi } from '@/services/brand.service'

// breadcrumb
const routes = ref([
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Create brand',
    path: '/create-brand',
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
  console.log('valll', val)
  const { name } = val

  const data = {
    name: name,
    photos: base64String.value,
  }
  // create product
  try {
    await createBrandApi(data)
    toast.success('Creation success!')
  } catch (error) {
    console.error('Creation error:', error)
    toast.error('Creation failed!')
  }
}

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
  }),
})

const onRegister = () => {
  handleSubmit(onCreate)()
}

let base64String = ref(null)
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
        <h1 class="text-2xl font-semibold">Create new brand</h1>
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
