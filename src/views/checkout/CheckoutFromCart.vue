<template>
  <div v-if="store.state.cart.items.length < 1" class="flex justify-center items-center h-[200px]">
    <div class="flex flex-col items-center">
      <h4 class="text-2xl font-bold mb-2">Sepetinizde Ürün Bulunmuyor</h4>
      <i class="ri-error-warning-line text-red-500 text-4xl"></i>
    </div>
  </div>

  <div v-else class="flex w-full px-5 pt-7 justify-center gap-5">
    <div class="flex w-full flex-col gap-5 max-w-[1200px] max-[1254px]:w-full h-fit rounded-[8px] justify-center py-5">
      <div class="w-full flex flex-col gap-10">
        <div class="flex flex-row-reverse gap-20">
          <div>
            <div class="mt-5 shadow-d-20 w-[370px] h-fit rounded-lg border-[1px]">
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
                  title="Alışverişi Tamamla"
                  class="text-white text-lg font-medium flex justify-center py-3"
                  @click="checkout"
                />
              </div>
            </div>
          </div>
          <div class="flex-auto flex flex-col gap-7">
            <div class="border-b-[1px] mt-7"></div>
            <div v-for="item in store.state.cart.items" :key="item.id">
              <div class="flex gap-4 items-center">
                <LazyImg
                  class-style="w-[150px] h-[150px] rounded-md"
                  :src="`../../../public/images/products/${item.product.photos}`"
                  alt=""
                />
                <div class="flex flex-col">
                  <RouterLink :to="`/products/${item.product._id}`" class="font-medium text-base">{{
                    item.product.name
                  }}</RouterLink>
                  <div style="width: 120px; height: 30px; margin-top: 10px">
                    <ANumberInput :item="item" />
                  </div>
                  <div class="flex justify-start items-center mt-3">
                    <div class="button-container">
                      <button class="tab-button" @click="removeFromCart(item.product._id)">
                        <i class="ri-delete-bin-6-line"></i>
                        <span>Sepetimden Çıkar</span>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="ml-auto text-base font-semibold">{{ item.product.price * item.quantity }} TL</p>
              </div>
              <div class="border-b-[1px] mt-7"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
// components
import AButton from '@/components/commons/atoms/AButton.vue'
import ANumberInput from '@/components/commons/atoms/ANumberInput.vue'
// services
import { removeProductFromCartApi } from '@/services/cart.service'
// stores
import store from '@/stores/master.store'

import { useRoute, useRouter } from 'vue-router'
import LazyImg from '@/components/commons/atoms/LazyImg.vue'
import authStore from '@/stores/auth.store'
const route = useRoute()
const router = useRouter()

onBeforeMount(async () => {
  listCheckout.value = store.state.cart.items
})

const checkout = async () => {
  if (!authStore.state.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  } else {
    router.push('/siparis') // Yönlendirmek istediğiniz sayfanın yolunu buraya yazın
  }
}

const listCheckout = ref([])

const removeFromCart = async (productId) => {
  const removedFromCart = await removeProductFromCartApi(store.state.cart._id, productId)
  store.dispatch('updateCart', removedFromCart.data.data.data)
}
</script>

<style scoped>
.tab-button {
  display: flex;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s, opacity 0.3s;
  opacity: 0.4; /* Başlangıçta soluk */
  margin-top: 15px;
}

.tab-button i {
  font-size: 14px; /* İkon boyutu */
  margin-right: 8px; /* İkon ve yazı arasındaki boşluk */
}

.tab-button:hover {
  opacity: 1; /* Fare üzerine gelince opak hale gelir */
  background-color: #f5f5f5; /* Fare üzerine gelince arka plan rengi değişir */
}
</style>
