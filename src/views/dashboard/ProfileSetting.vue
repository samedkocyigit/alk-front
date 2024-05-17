<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import * as yup from 'yup'

import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import AButton from '@/components/commons/atoms/AButton.vue'
import ADropdown from '@/components/commons/atoms/ADropdown.vue'
import ModalChangeAvatar from '@/components/profiles/ModalChangeAvatar.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
import AddShippingAddress from '@/components/profiles/AddShippingAddress.vue'
import { fileToBase64 } from '@/utils/file'
import { AuthStore } from '@/stores/auth.store'
const authStore = AuthStore.value
// services
import { getLocationApi, getShippingAddressApi } from '@/services/order.service'
import { updateMeApi } from '@/services/user.service'
import { toast } from 'vue3-toastify'
import { useForm } from 'vee-validate'
defineProps({
  type: {
    type: String,
    default: 'VIEW',
  },
})
// breadcrumb
const routes = ref([
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Profile setting',
    path: '/',
  },
])
const locations = ref([])
const userData = ref(null)
onBeforeMount(() => {
  getLocation()
  getShippingAddress()
  console.log('authStore', authStore)
  userData.value = { ...authStore?.user }
  console.log('nedir :', userData.value)
})

const submit = async (val) => {
  try {
    console.log('val değeri', val)
    await updateMeApi(userData.value._id, val)
    toast.success('Güncelleme Başarılı')
  } catch (err) {
    console.log(err)
    toast.error('Güncelleme Başarız')
  }
}
const getLocation = async () => {
  const res = await getLocationApi()
  locations.value = res.data
  console.log('locations', locations.value)
}

const cities = computed(() => {
  return locations.value.map((location) => ({
    id: location.id,
    name: location.name,
    code: location.code,
  }))
})

const districts = computed(() => {
  const city = locations.value.find((location) => location.id === userData.value.cityId)
  return city?.districts.map((district) => ({
    id: district.id,
    name: district.name,
    code: district.code,
  }))
})
const modal = ref({
  changeAvatar: false,
})
const inputFileElement = ref(null)
const openChooseFile = () => {
  inputFileElement.value.click()
}
const imgBase64 = ref(null)
const onChooseFile = async (e) => {
  const file = e.target.files[0]
  const base64 = await fileToBase64(file)
  imgBase64.value = base64
  modal.value.changeAvatar = true
  console.log('base64', base64)
  inputFileElement.value.value = ''
}

const onUpdateAvatar = (file) => {
  authStore.user.avatar = file
  modal.value.changeAvatar = false
}

// handle shipping address
const shippingAddress = ref([])
const getShippingAddress = async () => {
  try {
    const res = await getShippingAddressApi()
    shippingAddress.value = res.data.reverse()
    console.log('shippingAddress', shippingAddress.value)
  } catch (error) {
    console.log('error', error)
  }
}

const onAddNewShippingAddress = (val) => {
  shippingAddress.value.unshift(val)
  isShowAddShippingAddress.value = false
  console.log('onAddNewShippingAddress')
}
const isShowAddShippingAddress = ref(false)
const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string(),
    surname: yup.string(),
    email: yup.string().email(),
    phone: yup.number(),
    gender: yup.string(),
    taxOffice: yup.string(),
    taxNumber: yup.number(),
  }),
})
const onUpdate = () => {
  handleSubmit(submit)()
}
</script>

<template>
  <ModalChangeAvatar
    v-if="modal.changeAvatar"
    :img="imgBase64"
    @cropped="onUpdateAvatar"
    @close="modal.changeAvatar = false"
  />
  <div class="max-lg:p-5 relative flex flex-col w-full h-fit p-10 bg-[#fafafa] pt-10 rounded-[8px] py-5">
    <header class="max-lg:flex-col flex gap-2 justify-between w-full pb-5">
      <!-- breadcrumb -->
      <div>
        <h1 class="text-2xl font-semibold">Profil Ayarları</h1>
        <BreadCrumb :routes="routes" />
      </div>
      <!-- action -->
      <div class="flex gap-2 sticky top-0">
        <AButton title="Cancel" type="close" class="w-fit h-fit py-2 px-3 bg-slate-200 text-gray-700" @click="onCreate">
          <template #left>
            <i class="ri-close-line"></i>
          </template>
        </AButton>
        <AButton title="Create" class="w-fit h-fit py-2 px-3 text-white bg-blue-500" @click="onUpdate">
          <template #left>
            <i class="ri-save-line"></i>
          </template>
        </AButton>
      </div>
    </header>
    <!-- avatar, bg -->
    <!--  -->
    <!-- information -->
    <div class="max-lg:flex-col w-full flex lg:flex-row-reverse gap-5 mt-10">
      <!-- position for shipping -->
      <div class="max-lg:w-full max-lg:min-w-[unset] w-[300px] min-w-[400px] bg-white rounded-2xl p-5">
        <div class="flex justify-between items-center">
          <p class="text-lg font-semibold">Shipping address</p>
          <div
            class="w-10 h-10 rounded-full cursor-pointer flex justify-center items-center hover:bg-slate-200"
            @click="isShowAddShippingAddress = !isShowAddShippingAddress"
          >
            <i class="ri-add-fill text-xl"></i>
          </div>
        </div>
        <div class="w-full flex flex-col mt-4 gap-3">
          <AddShippingAddress
            v-if="isShowAddShippingAddress"
            :locations="locations"
            @added="onAddNewShippingAddress"
            @close="isShowAddShippingAddress = false"
          />
          <!-- shipping address item -->
          <div v-for="item in shippingAddress" :key="item.id" class="w-full border-[1px] rounded-lg p-4">
            <div class="flex w-full justify-between">
              <p class="font-semibold text-primary-200">{{ item.isMainAddress ? 'Default' : '' }}</p>
              <div>
                <i class="ri-more-fill"></i>
              </div>
            </div>
            <div class="mt-2">
              <p class="text-base flex items-center gap-2 font-medium">
                <i class="ri-map-pin-2-fill text-xl text-secondary-100"></i> {{ [item.city, item.district].join(', ') }}
              </p>
              <p class="text-base mt-2 flex items-center gap-2 font-medium">
                <i class="ri-user-fill text-xl text-secondary-100"></i> {{ item.name }}
              </p>
              <p class="text-base mt-2 flex items-center gap-2 font-medium">
                <i class="ri-phone-fill text-xl text-secondary-100"></i> {{ item.phoneNumber }}
              </p>
            </div>
          </div>
          <!--end shipping address item -->
        </div>
      </div>
      <!-- information -->
      <div class="flex-auto bg-white rounded-2xl p-5 flex flex-col gap-5">
        <h2 class="text-lg font-semibold">Üye Bilgilerim</h2>
        <AInput v-model="name" name="name" label="Adı" :placeholder="userData.name" />
        <AInput v-model="surname" name="surname" label="Soyadı" :placeholder="userData.surname" />
        <AInput v-model="email" name="email" label="Email" :placeholder="userData.email" />
        <div class="w-full">
          <AInput
            v-model="gender"
            name="gender"
            label="Cinsiyet"
            :options="[
              { value: 'erkek', label: 'Erkek' },
              { value: 'kadin', label: 'Kadın' },
              { value: 'belirtmek-istemiyorum', label: 'Belirtmek İstemiyorum' },
            ]"
            type="radio"
          />
        </div>
        <AInput v-model="phone" name="phone" label="Telefon Numarası" :placeholder="userData.phone" />
        <AInput v-model="taxOffice" name="taxOffice" label="Vergi Dairesi" :placeholder="userData.taxOffice" />
        <AInput v-model="taxNumber" name="taxNumber" label="Vergi Numarası" :placeholder="userData.taxNumber" />
        <!-- <div class="w-full flex gap-5">
          <ADropdown
            v-if="cities"
            v-model="userData.cityId"
            class="w-full h-full"
            is-required="true"
            label="Şehir"
            :options="cities"
            placeholder="Select category..."
            required
          />
          <ADropdown
            v-model="userData.districtId"
            class="w-full h-full"
            is-required="true"
            label="İlçe"
            :options="districts"
            placeholder="Select category..."
            required
          />
        </div> -->
        <!-- <AInput label="Adres Detayı" placeholder="Enter your address..." /> -->
      </div>
    </div>
  </div>
</template>
