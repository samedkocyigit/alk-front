<script setup>
import { ref } from 'vue'
import * as yup from 'yup'

import BreadCrumb from '@/components/commons/BreadCrumb.vue'
import AButton from '@/components/commons/atoms/AButton.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
import authStore from '@/stores/auth.store'
// services
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
// const userData = ref(null)
// onBeforeMount(() => {
//   userData.value = authStore.state.user
// })

const submit = async (val) => {
  try {
    await updateMeApi(userData.value._id, val)
    toast.success('Güncelleme Başarılı')
  } catch (err) {
    console.log(err)
    toast.error('Güncelleme Başarız')
  }
}

const modal = ref({
  changeAvatar: false,
})

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
  <!-- <ModalChangeAvatar
    v-if="modal.changeAvatar"
    :img="imgBase64"
    @cropped="onUpdateAvatar"
    @close="modal.changeAvatar = false"
  /> -->
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
          <!-- <div
            class="w-10 h-10 rounded-full cursor-pointer flex justify-center items-center hover:bg-slate-200"
            @click="isShowAddShippingAddress = !isShowAddShippingAddress"
          >
            <i class="ri-add-fill text-xl"></i>
          </div> -->
        </div>
        <!-- <div class="w-full flex flex-col mt-4 gap-3"> -->
        <!-- shipping address item -->
        <!-- <div v-for="item in shippingAddress" :key="item.id" class="w-full border-[1px] rounded-lg p-4">
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
          </div> -->
        <!--end shipping address item -->
        <!-- </div> -->
      </div>
      <!-- information -->
      <div class="flex-auto bg-white rounded-2xl p-5 flex flex-col gap-5">
        <h2 class="text-lg font-semibold">Üye Bilgilerim</h2>
        <AInput v-model="name" name="name" label="Adı" :placeholder="authStore.state.user.name" />
        <AInput v-model="surname" name="surname" label="Soyadı" :placeholder="authStore.state.user.surname" />
        <AInput v-model="email" name="email" label="Email" :placeholder="authStore.state.user.email" />
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
        <AInput v-model="phone" name="phone" label="Telefon Numarası" :placeholder="authStore.state.user.phone" />
        <AInput
          v-model="taxOffice"
          name="taxOffice"
          label="Vergi Dairesi"
          :placeholder="authStore.state.user.taxOffice"
        />
        <AInput
          v-model="taxNumber"
          name="taxNumber"
          label="Vergi Numarası"
          :placeholder="authStore.state.user.taxNumber"
        />
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
