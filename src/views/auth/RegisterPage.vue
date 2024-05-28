<template>
  <div class="w-[80%] border">
    <div class="w-[70%] mx-auto">
      <div class="w-full">
        <div class="w-full flex flex-col items-center justify-center">
          <RouterLink to="/" class="font-bold text-lg ml-2 mt-5">
            <div class="logo-container">
              <img src="../../../public/images/logo.png" alt="" class="logo-img" />
            </div>
          </RouterLink>
          <p class="text-3xl font-bold">Üye Ol</p>
          <p class="text-base font-medium mt-2">Fırsatlardan Yararlanabilmek İçin Üye Olun</p>
        </div>
        <div class="w-full flex flex-col items-center justify-center mt-10">
          <div class="w-full">
            <AInput v-model="name" label="Ad" name="name" style-custom="border-[#AFA2C3]" is-required />
          </div>
          <div class="w-full">
            <AInput v-model="surname" label="Soyad" name="surname" style-custom="border-[#AFA2C3]" is-required />
          </div>
          <div class="w-full">
            <AInput
              v-model="email"
              label="Email"
              name="email"
              style-custom="border-[#AFA2C3]"
              is-required
              type="email"
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="password"
              label="Şifre"
              name="password"
              style-custom="border-[#AFA2C3]"
              is-required
              type="password"
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="gender"
              name="gender"
              label="Cinsiyet"
              is-required
              :options="[
                { value: 'erkek', label: 'Erkek' },
                { value: 'kadin', label: 'Kadın' },
                { value: 'belirtmek-istemiyorum', label: 'Belirtmek İstemiyorum' },
              ]"
              type="radio"
            />
          </div>

          <div class="w-full mt-5">
            <AInput
              v-model="phone"
              name="phone"
              label="İlgili Cep Telefonu"
              style-custom="border-[#AFA2C3]"
              placeholder="(5XX) XXX XX XX "
            />
          </div>
          <div class="w-full">
            <AInput v-model="taxOffice" label="Vergi Dairesi" name="taxOffice" style-custom="border-[#AFA2C3]" />
          </div>
          <div class="w-full">
            <AInput v-model="taxNumber" label="Vergi No" name="taxNumber" style-custom="border-[#AFA2C3]" />
          </div>
          <!-- forgot -->
          <div class="w-full flex gap-3 mt-5">
            <button class="bg-[#3E334E] text-white flex-[1] w-full py-3 font-bold rounded-lg" @click="onRegister">
              Üye Ol
            </button>
            <RouterLink
              to="/users/login"
              class="block text-center border-[1px] border-[#3E334E] text-[#3E334E] flex-[1] w-full font-bold py-3 rounded-lg"
            >
              Giriş
            </RouterLink>
          </div>
          <!-- copyright -->
          <div class="w-full flex justify-center mt-5">
            <p class="text-[#3E334E] text-sm font-medium">© 2021 superbadstore</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import AInput from '@/components/commons/atoms/AInput.vue'
import { signUpApi } from '@/services/auth.service'
const router = useRouter()

const submit = async (val) => {
  try {
    // // Önce veritabanından kullanıcı bilgilerini al
    // const existingUser = await getUserByEmail(email)

    // // Kullanıcı zaten varsa hata fırlat
    // if (existingUser) {
    //   throw new Error('User with this email already exists')
    // }

    // Kullanıcı yoksa yeni kullanıcı oluştur
    await signUpApi(val)

    toast.success('Register success!')
    router.push('/users/login')
  } catch (error) {
    console.error('Registration error:', error)
    toast.error('Register failed!')
  }
}

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    surname: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().required().min(8, 'Password must contain at least 8 characters'),
    phone: yup.number(),
    gender: yup.string().required(),
    taxOffice: yup.string(),
    taxNumber: yup.number(),
  }),
})

const onRegister = () => {
  handleSubmit(submit)()
}
// const showPassword = ref(false)

// const togglePasswordVisibility = () => {
//   showPassword.value = !showPassword.value
// }
</script>
