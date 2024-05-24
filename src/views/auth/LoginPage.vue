<template>
  <div class="max-md:gap-3 max-md:flex-col min-h-screen h-screen flex">
    <div class="max-md:h-[250px] lg:flex-auto bg-[#191a24] flex items-center px-10">
      <img class="w-full h-full object-cover opacity-[60%]" src="@@/icons/travel.svg" alt="" />
    </div>
    <div class="max-md:w-full w-[45%]">
      <div class="max-md:w-[80%] mx-auto flex flex-col items-center justify-center h-full px-40">
        <div class="w-full flex flex-col items-center justify-center mt-10">
          <RouterLink to="/" class="font-bold text-lg ml-2 mt-5">
            <div class="logo-container">
              <img src="../../../public/images/logo.png" alt="" class="logo-img" />
            </div>
          </RouterLink>
          <p class="text-3xl font-bold">Üye Girişi</p>
          <p class="text-base font-medium mt-2">Hesabınıza Giriş Yapın</p>
        </div>
        <div class="w-full flex flex-col items-center justify-center mt-10">
          <div class="w-full">
            <AInput
              name="email"
              label="Email"
              style-custom="border-[#AFA2C3]"
              is-required
              placeholder="Email giriniz..."
            />
          </div>
          <div class="w-full mt-5">
            <AInput
              name="password"
              label="Şifre"
              style-custom="border-[#AFA2C3]"
              is-required
              placeholder="Şifrenizi giriniz..."
              type="password"
            />
          </div>
          <!-- forgot -->
          <div class="w-full flex justify-end mt-2">
            <RouterLink to="/forgot-password" class="text-[#3E334E] text-sm font-medium">Şifremi Unuttum</RouterLink>
          </div>
          <div class="w-full flex gap-3 mt-5">
            <button class="bg-[#3E334E] text-white flex-[1] w-full py-3 font-bold rounded-lg" @click="onLogin">
              Giriş Yap
            </button>
            <RouterLink
              to="/register"
              class="block text-center border-[1px] border-[#3E334E] text-[#3E334E] flex-[1] w-full font-bold py-3 rounded-lg"
            >
              Üye Ol
            </RouterLink>
          </div>
          <!-- copyright -->
          <div class="w-full flex justify-center mt-5">
            <p class="text-[#3E334E] text-sm font-medium">© 2024 superbadstore</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AInput from '@/components/commons/atoms/AInput.vue'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { loginAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { loginApi } from '@/services/auth.service'
import store from '@/stores/master.store'
import { addToCartApi, getCartApi, removeCartApi } from '@/services/cart.service'

const router = useRouter()

const submit = async (val) => {
  try {
    const res = await loginApi(val)
    if (res.status === 200) {
      const token = res.data.token
      const user = res.data.data.data
      localStorage.setItem('access_token', token)
      console.log('responseUser-->', user)

      await loginAuthStore(user)
      const redirect = localStorage.getItem('redirect')

      if (store.state.cart.items.length > 0) {
        await addToCartApi(user.cart, {
          items: store.state.cart.items,
        })
      }
      const response = await getCartApi(user.cart)
      store.dispatch('cartConvert', response.data.data.data)
      if (redirect) {
        router.push(redirect)
      } else {
        router.push('/')
        localStorage.removeItem('redirect')
      }
    } else {
      console.log('girmiyo mu la')
      throw new Error('Invalid response status: ' + res.status)
    }
  } catch (err) {
    console.error(err) // Hata detaylarını konsola yazdır
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
    toast.error('Incorrect email or password')
  }
}

// validate password have min 8, have number vs uppercase
const { handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters long'),
  }),
})

const onLogin = () => {
  handleSubmit(submit)()
}
</script>
