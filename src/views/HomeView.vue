<template>
  <div class="flex w-full justify-center flex-col items-center">
    <BannerSlide />
    <ShopList />
    <div class="flex w-full max-w-[1400px] max-[1254px]:w-full h-fit rounded-[8px] justify-center py-5">
      <div class="w-full">
        <div class="px-2 pb-5 max-md:block hidden">
          <SearchWrapper class="w-full" />
        </div>
        <FlashSaleList />
        <PromotionList />
        <FlashSaleList />
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchWrapper from '@/components/search/SearchWrapper.vue'
import BannerSlide from '@/components/sliders/BannerSlide.vue'
import FlashSaleList from '@/components/products/FlashSaleList.vue'
import PromotionList from '@/components/home/PromotionList.vue'
import ShopList from '@/components/home/ShopList.vue'
</script>
