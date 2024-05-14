<script setup>
  import Modal from './Index.vue'

  defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits([
    'abandon',
    'cancel'
  ])
</script>

<template>
  <Modal
    :visible
    primary-button-text='Cancel'
    @primary-button-click="emit('cancel')"
    secondary-button-text='Yes'
    @secondary-button-click="emit('abandon')"
    invert-buttons
  >
    <p>
      Are you sure you want to abandon the match?
    </p>
  </Modal>
</template>