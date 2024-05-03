<template>
  <div class="max-md:gap-3 max-md:flex-col min-h-screen h-screen flex">
    <div class="max-md:h-[250px] lg:flex-auto bg-[#191a24] flex items-center px-10">
      <img class="w-full h-full object-cover opacity-[60%]" src="@@/icons/travel.svg" alt="" />
    </div>
    <div class="max-md:w-full w-[45%] flex justify-start">
      <div class="max-md:w-full w-[80%] flex flex-col items-center justify-center h-full px-10">
        <div class="w-full flex flex-col items-center justify-center">
          <p class="text-3xl font-bold">Register</p>
          <p class="text-base font-medium mt-2">Register and explore the online market</p>
        </div>
        <div class="w-full flex flex-col items-center justify-center mt-10">
          <div class="w-full">
            <AInput
              v-model="name"
              label="Name"
              name="name"
              style-custom="border-[#AFA2C3]"
              is-required
              placeholder="Enter your name..."
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="surname"
              label="Surname"
              name="surname"
              style-custom="border-[#AFA2C3]"
              is-required
              placeholder="Enter your surname..."
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="email"
              label="Email"
              name="email"
              style-custom="border-[#AFA2C3]"
              is-required
              placeholder="Enter your email..."
              type="email"
            />
          </div>
          <div class="w-full">
            <AInput
              v-model="password"
              label="Password"
              name="password"
              style-custom="border-[#AFA2C3]"
              is-required
              placeholder="Enter your password..."
              type="password"
            />
          </div>
          <!-- <div class="absolute inset-y-0 right-0 flex items-center justify-center h-full mr-2">
              <button @click="togglePasswordVisibility">
                <i v-if="isPassword && !showPassword" class="ri-eye-fill"></i>
                <i v-else class="ri-eye-off-fill"></i>
              </button>
            </div> -->
          <div class="w-full">
            <AInput
              v-model="gender"
              label="Cinsiyet"
              name="gender"
              style-custom="border-[#AFA2C3]"
              is-required
              placeholder="Enter your gender..."
            />
          </div>
          <div class="w-full mt-5">
            <AInput
              v-model="phone"
              name="phone"
              label="İlgili Cep Telefonu"
              style-custom="border-[#AFA2C3]"
              placeholder="Enter your phone number..."
            />
          </div>
          <!-- forgot -->
          <div class="w-full flex justify-end mt-2">
            <RouterLink to="/forgot-password" class="text-[#3E334E] text-sm font-medium">Forgot password?</RouterLink>
          </div>
          <div class="w-full flex gap-3 mt-5">
            <button class="bg-[#3E334E] text-white flex-[1] w-full py-3 font-bold rounded-lg" @click="onRegister">
              Sign up
            </button>
            <RouterLink
              to="/users/login"
              class="block text-center border-[1px] border-[#3E334E] text-[#3E334E] flex-[1] w-full font-bold py-3 rounded-lg"
            >
              Login
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
  // const { name, surname, email, password, gender, phone } = val
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
    gender: yup.string().required(),
    phone: yup.number(),
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
