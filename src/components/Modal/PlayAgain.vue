<script setup>
  import Modal from './Index.vue'

  defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    winner: String
  })
  const emit = defineEmits([
    'yes',
    'no'
  ])

</script>

<template>
  <Modal
    :visible="visible"
    primary-button-text='Yes'
    secondary-button-text='No'
    @primary-button-click="emit('yes')"
    @secondary-button-click="emit('no')"
    :title="`${winner} won!`"
  >
    <p> Do you want to play again?</p>
  </Modal>
</template>

