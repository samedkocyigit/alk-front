<template>
  <div class="flex w-full justify-center flex-col items-center">
    <div class="flex w-full max-w-[1200px] max-[1254px]:w-full h-fit rounded-[8px] justify-center py-3">
      <div class="w-full">
        <div class="px-2 pb-5 max-md:block hidden">
          <SearchWrapper class="w-full" />
        </div>
        <CategoryProducts />
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchWrapper from '@/components/search/SearchWrapper.vue'
import CategoryProducts from '@/components/products/CategoryProducts.vue'
</script>
