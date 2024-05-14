<script setup>
import Layout from '@/layout/Index.vue'
import Button from 'primevue/button'
import { RouterLink } from 'vue-router'
</script>

<template>
  <Layout>
    <section>
      <RouterLink to="/local">
        <Button label="Play" size="large" />
      </RouterLink>
    </section>
  </Layout>
</template>

<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
