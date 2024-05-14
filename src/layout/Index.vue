<script setup>
import Nav from './Nav.vue'

defineProps({
  showNav: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <Nav v-if="showNav" />
  <main>
    <slot></slot>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 0.5rem;
  padding-top: 1rem !important;
  min-width: 320px;
  max-width: 100vw;
}

@media screen and (min-width: 768px) {
  main {
    min-width: 768px;
    padding: 0 3rem;
  }
}

@media screen and (min-width: 1024px) {
  main {
    min-width: 1024px;
    padding: 0 6rem;
  }
}
</style>
