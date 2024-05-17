<template>
  <div class="flex w-full px-5 pt-7 justify-center gap-5">
    <div class="flex w-full flex-col gap-2 max-w-[1200px] max-[1254px]:w-full h-fit rounded-[8px] justify-center py-10">
      <div class="w-full"></div>
      <div class="w-full flex flex-col gap-10">
        <p class="text-xl font-bold">Favori Ürünlerim ({{ authStore.user.favoriteItems.length }})</p>
        <table class="min-w-full bg-white border">
          <thead>
            <tr>
              <th class="py-2 px-4 border">Ürün Adı</th>
              <th class="py-2 px-4 border">Fiyat</th>
              <th class="py-2 px-4 border">KDV'li Fiyat</th>
              <th class="py-2 px-4 border">Ürün Sil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in authStore.user.favoriteItems" :key="item._id">
              <td class="py-2 px-4 border flex items-center">
                <LazyImg
                  class-style="w-[50px] h-[50px] rounded-md"
                  :src="`../../../public/images/products/${item.photos}`"
                  alt=""
                />
                <RouterLink :to="`/products/${item._id}`" class="ml-2 font-medium text-base">{{
                  item.name
                }}</RouterLink>
              </td>
              <td class="py-2 px-4 border">{{ item.price }} TL</td>
              <td class="py-2 px-4 border">{{ (item.price * (1 + vatRate)).toFixed(2) }} TL</td>
              <td class="py-2 px-4 border text-center">
                <button @click="removeItem(item._id)" class="text-red-500">Sil</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AuthStore } from '@/stores/auth.store'
import LazyImg from '@/components/commons/atoms/LazyImg.vue'
import { ref } from 'vue'
import { updateUserApi } from '@/services/user.service'

const authStore = AuthStore.value
const vatRate = 0.2 // %18 KDV oranı

const removeItem = async (id) => {
  const userId = authStore.user._id
  const res = await updateUserApi(userId, {
    $pull: { favoriteItems: id },
  })
  console.log('laaaaaaaaan', res.data.data.data.favoriteItems, authStore.user.favoriteItems)

  authStore.user.favoriteItems = res.data.data.data.favoriteItems
}
</script>
