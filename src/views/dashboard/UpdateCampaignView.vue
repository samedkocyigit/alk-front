<script setup>
import { computed, ref } from 'vue'
import '@@/css/quill.snow.css'
import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import AButton from '@/components/commons/atoms/AButton.vue'
import AFullLoading from '@/components/commons/atoms/AFullLoading.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
import ADropdown from '@/components/commons/atoms/ADropdown.vue'

// services
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { toast } from 'vue3-toastify'
import { updateSliderApi } from '@/services/slider.service'
import store from '@/stores/master.store'

const selectedSlider = ref(null)
const sliders = computed(() => store.state.sliders)
const slidersOptions = computed(() => {
  return sliders.value.data.map((slider) => ({
    id: slider._id,
    label: slider.name,
  }))
})

// breadcrumb
const routes = ref([
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Create campaign',
    path: '/create-campaign',
  },
])

const base64MainSlider = ref('')
const base64Thumbnail = ref('')
const errorMessage = ref('')
const fileInputMain = ref(null)
const fileInputThumb = ref(null)
const isCreating = ref(false)

const handleFileChange = (event, type) => {
  const file = event.target.files[0]
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'Dosya boyutu çok büyük'
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    if (type === 'main') {
      base64MainSlider.value = reader.result
    } else {
      base64Thumbnail.value = reader.result
    }
  }
}

const onCreate = async () => {
  const data = {
    photos: [base64MainSlider.value, base64Thumbnail.value],
  }
  console.log('sssssssss', selectedSlider.value)
  try {
    await updateSliderApi(selectedSlider.value, data)
    toast.success('Creation success!')
    base64MainSlider.value = ''
    base64Thumbnail.value = ''
  } catch (error) {
    console.error('Creation error:', error)
    toast.error('Creation failed!')
  }
}

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string(),
  }),
})

const onRegister = () => {
  handleSubmit(onCreate)()
}
</script>

<template>
  <AFullLoading v-show="isCreating">
    <template #content>
      <p class="text-lg">Creating Campaign...</p>
    </template>
  </AFullLoading>
  <div class="max-lg:p-5 max-md:pt-10 relative flex flex-col w-full h-fit p-10 bg-[#fafafa] pt-10 rounded-[8px] py-5">
    <header class="max-md:flex-col flex gap-2 justify-between w-full border-b-2 pb-5">
      <div>
        <h1 class="text-2xl font-semibold">Create new campaign</h1>
        <BreadCrumb :routes="routes" />
      </div>
      <div class="flex gap-2">
        <AButton title="Cancel" type="cancel" class="w-fit h-fit py-2 px-3 bg-slate-200 text-primary-200">
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
        <div class="flex flex-col w-full gap-6">
          <ADropdown v-model="selectedSlider" class="w-full h-full" label="Başlıklar" :options="slidersOptions" />
          <div>
            <p>Select Main Slider Photo</p>
            <input type="file" ref="fileInputMain" @change="(event) => handleFileChange(event, 'main')" />
          </div>
          <div>
            <p>Select Thumbnail Photo</p>
            <input type="file" ref="fileInputThumb" @change="(event) => handleFileChange(event, 'thumb')" />
          </div>
          <p class="text-red-500">{{ errorMessage }}</p>
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
