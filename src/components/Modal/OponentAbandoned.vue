<script setup>
import Modal from './Index.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Modal :visible="visible" primary-button-text="Ok" @primary-button-click="emit('close')">
    <p>Your oponent abanoned the match</p>
  </Modal>
</template>
