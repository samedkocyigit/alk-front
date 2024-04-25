<script setup>
import { defineProps, ref, onMounted } from 'vue'
import LazyImg from '../commons/atoms/LazyImg.vue'

const props = defineProps({
  campaign: {
    type: Object,
    required: true,
  },
  width: {
    type: String,
    default: 'w-full',
  },
})

const photoName = ref('')

onMounted(() => {
  photoName.value = props.campaign.photos[0]
  console.log('Kampanya foto adı:', photoName.value)
})
</script>

<template>
  <div :class="`flex flex-col h-[600px] overflow-hidden campaign-card-shadow bg-white rounded-xl mt-200 ${width}`">
    <LazyImg class-style="h-[600px] object-cover w-full" :src="`./images/campaigns/${photoName}`" alt="" />
  </div>
</template>

<style scoped>
/* BrandCard için genel stil ayarları */
.w-fit {
  width: auto; /* Öğelerin genişliğini içeriğe göre otomatik ayarla */
  display: inline-block; /* Öğeleri yan yana göster */
  white-space: nowrap; /* Öğelerin bir araya sığmasını sağla */
}

/* Swipe efekti için hover durumunda gösterge değiştirme */
.swiper-slide:hover {
  cursor: pointer; /* Üzerine gelindiğinde imleci değiştir */
  transform: scale(1.05); /* Üzerine gelindiğinde öğeyi büyüt */
  transition: transform 0.3s ease; /* Dönüşüm efekti süresi ve geçiş türü */
}
</style>
