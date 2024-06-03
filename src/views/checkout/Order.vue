<template>
  <div class="checkout-complete-container">
    <h2 class="text-3xl font-bold mb-5">Sipariş Tamamla</h2>

    <div class="checkout-layout">
      <div class="address-section">
        <div v-if="showAddressForm" class="address-form">
          <h3 class="text-xl font-semibold mb-3">Adres Bilgilerinizi Giriniz</h3>
          <form @submit.prevent="onRegister">
            <div class="form-group">
              <AInput
                v-model="address_title"
                label="Adres Başlığı"
                name="address_title"
                style-custom="border-[#AFA2C3]"
                is-required
              />
            </div>
            <div class="form-group-row">
              <div class="form-group">
                <AInput v-model="name" label="Ad" name="name" style-custom="border-[#AFA2C3]" is-required />
              </div>
              <div class="form-group">
                <AInput v-model="surname" label="Soyad" name="surname" style-custom="border-[#AFA2C3]" is-required />
              </div>
            </div>
            <div class="form-group-row">
              <div class="form-group">
                <AInput v-model="country" label="Ülke" name="country" style-custom="border-[#AFA2C3]" is-required />
              </div>
              <div class="form-group">
                <AInput v-model="province" label="Şehir" name="province" style-custom="border-[#AFA2C3]" is-required />
              </div>
              <div class="form-group">
                <AInput v-model="district" label="İlçe" name="district" style-custom="border-[#AFA2C3]" is-required />
              </div>
            </div>
            <div class="form-group-row">
              <div class="form-group">
                <AInput v-model="phone" label="Telefon" name="phone" style-custom="border-[#AFA2C3]" />
              </div>
              <div class="form-group">
                <AInput
                  v-model="cell_phone"
                  label="Cep Telefonu"
                  name="cell_phone"
                  style-custom="border-[#AFA2C3]"
                  placeholder="5XXXXXXXXX"
                  is-required
                />
              </div>
              <div class="form-group">
                <AInput v-model="id_no" label="Tc No" name="id_no" style-custom="border-[#AFA2C3]" />
              </div>
            </div>
            <div class="form-group">
              <AInput
                v-model="address"
                label="Adres"
                name="address"
                style-custom="border-[#AFA2C3]"
                type="textarea"
                is-required
              />
            </div>
            <div class="form-group">
              <AInput
                v-model="bill_type"
                name="bill_type"
                label="Fatura Tipi"
                is-required
                :options="[
                  { value: 'Bireysel', label: 'Bireysel' },
                  { value: 'Kurumsal', label: 'Kurumsal' },
                ]"
                type="radio"
              />
            </div>
            <button class="bg-[#3E334E] text-white flex-[1] w-[48%] py-3 font-bold rounded-lg">İptal</button>
            <button class="bg-[#3E334E] text-white flex-[1] w-[48%] ml-3 py-3 font-bold rounded-lg" type="submit">
              Kaydet
            </button>
          </form>
        </div>

        <div v-else class="address-selection">
          <h3 class="text-xl font-semibold mb-3">Adres Seçimi</h3>
          <div v-for="address in authStore.state.user.address" :key="address._id" class="address-item">
            <input type="radio" :id="address._id" :value="address._id" v-model="selectedAddress" />
            <label :for="address._id">
              <div class="address-info">
                <p>{{ address.address_title }}</p>
                <p>{{ address.name }} {{ address.surname }}</p>
                <p>{{ address.address }}</p>
              </div>
            </label>
          </div>
          <button @click="toggleAddressForm" class="btn secondary">Yeni Adres Ekle</button>
          <!-- <button @click="confirmOrder" class="btn">Siparişi Ver</button> -->
        </div>
      </div>

      <div class="summary-section">
        <div class="mt-5 ml-3 shadow-d-20 w-[370px] h-fit rounded-lg border-[1px]">
          <div class="p-5 flex justify-between items-center border-b-[1px]">
            <p class="text-base font-semibold">Sepet Özeti</p>
          </div>
          <div class="p-5 flex flex-col gap-5 mt-3">
            <div class="flex justify-between items-center">
              <p class="text-base font-medium">Ara Toplam</p>
              <p class="text-base font-semibold">{{ store.state.cart.totalPrice }} TL</p>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-base font-medium">Kargo</p>
              <p class="text-base font-semibold">100 TL</p>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-base font-medium">Kdv</p>
              <p class="text-base font-semibold">{{ store.state.cart.totalPrice * 0.2 }} TL</p>
            </div>
          </div>
          <div class="p-5 py-3 border-t-[1px] flex justify-between items-center mt-3">
            <p class="text-base font-medium">Toplam</p>
            <p class="text-xl font-bold">{{ store.state.cart.totalPrice * 1.2 + 100 }} TL</p>
          </div>
          <p class="text-rose-600 px-5">{{ errValidate }}</p>
          <div class="p-5 pt-2">
            <AButton
              title="Sipariş Ver"
              class="text-white text-lg font-medium flex justify-center py-3"
              @click="checkout"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

import AButton from '@/components/commons/atoms/AButton.vue'
import AInput from '@/components/commons/atoms/AInput.vue'
import store from '@/stores/master.store'
import authStore from '@/stores/auth.store'
import { createAddressApi } from '@/services/address.service'
import { addAddressToUserApi } from '@/services/user.service'
import { createOrderApi } from '@/services/order.service'
import router from '@/router'
import { toast } from 'vue3-toastify'

const addresses = ref([]) // Kullanıcının adreslerinin tutulduğu dizi

const selectedAddress = ref(null) // Seçilen adresin ID'si
const errValidate = ref('')
const showAddressForm = ref(false)

onBeforeMount(() => {
  // Adresleri yükleme işlemi burada yapılabilir
  addresses.value = [] // Örneğin, bu veri bir API çağrısından gelebilir
})

const submit = async (val) => {
  // Yeni adresi kaydetme işlemi burada yapılabilir
  try {
    const newAddress = await createAddressApi({ ...val, user: authStore.state.user._id })
    const res = await addAddressToUserApi(authStore.state.user._id, newAddress.data.data.data._id)
    console.log('hahahahha', res.data.data.user.address)
    authStore.state.user.address = res.data.data.user.address
    console.log('hahahahha', authStore.state.user.address)
  } catch (err) {}
  showAddressForm.value = false
}

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    surname: yup.string().required(),
    address_title: yup.string().required(),
    address: yup.string().required(),
    country: yup.string().required(),
    province: yup.string().required(),
    district: yup.string().required(),
    phone: yup.string().required(),
  }),
})

const onRegister = () => {
  handleSubmit(submit)()
}
const toggleAddressForm = () => {
  showAddressForm.value = !showAddressForm.value
}

const confirmOrder = async () => {
  if (!selectedAddress.value) {
    errValidate.value = 'Lütfen bir adres seçin'
    return
  }
  try {
    // Sipariş onaylama işlemi burada yapılabilir
    const res = await createOrderApi(authStore.state.user._id, selectedAddress.value, store.state.cart._id)
    toast.success('Siparişiniz alınmıştır', {
      duration: 5000, // Toast'un 5 saniye boyunca görünmesi
      onMounted: (toastInstance) => {
        setTimeout(() => {
          toastInstance.goAway() // Toast'u gizle
          router.push('/') // Anasayfaya yönlendir
        }, 3000) // 5 saniye sonra toast'u gizle ve yönlendir
      },
    })
  } catch (error) {
    console.error('Sipariş onaylama sırasında hata oluştu:', error)
    errValidate.value = 'Sipariş onaylama sırasında bir hata oluştu. Lütfen tekrar deneyin.'
  }
}

const checkout = () => {
  console.log('noluyo', selectedAddress.value)
  if (!selectedAddress.value) {
    errValidate.value = 'Lütfen bir adres girin veya seçin'
    return
  }
  confirmOrder()
}
</script>

<style scoped>
.checkout-complete-container {
  padding: 20px;
}

.checkout-layout {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.address-section {
  flex: 2;
}

.summary-section {
  flex: 1;
}

.address-form,
.address-selection {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group-row {
  display: flex;
  gap: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: border-color 0.3s, background-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #007bff;
  background-color: #fff;
}

.form-group textarea {
  height: 100px;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-label {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  user-select: none;
}

.radio-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-custom {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 50%;
  transform: translateY(-50%);
}

.radio-label input:checked ~ .radio-custom {
  background-color: #007bff;
  border-color: #007bff;
}

.radio-custom::after {
  content: '';
  position: absolute;
  display: none;
}

.radio-label input:checked ~ .radio-custom::after {
  display: block;
}

.radio-label .radio-custom::after {
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  transform: translate(-50%, -50%);
}

.address-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: background-color 0.3s, border-color 0.3s;
}

.address-item:hover {
  background-color: #e9e9e9;
}

.address-info {
  margin-left: 10px;
}

.address-info p {
  margin: 0;
}

.btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 10px;
}

.btn.secondary {
  background-color: #6c757d;
}

.btn:hover {
  background-color: #0056b3;
}

.btn.secondary:hover {
  background-color: #5a6268;
}

.summary-section .shadow-d-20 {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
