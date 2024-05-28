<template>
  <div>
    <h2>Taksit Seçenekleri</h2>
    <p>{{ installmentOptions }}</p>
  </div>
</template>

<script>
export default {
  props: ['installmentOptions'],
}
</script>
