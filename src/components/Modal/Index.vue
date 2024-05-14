<script setup>
  import Dialog from 'primevue/dialog'
  import Button from 'primevue/button'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    invertButtons: {
      type: Boolean,
      default: false
    },
    title: String,
    primaryButtonText: String,
    secondaryButtonText: String,
    onPrimaryButtonClick: Function,
    onSecondaryButtonClick: Function,
  })
  const emit = defineEmits([
    'primaryButtonClick',
    'secondaryButtonClick',
  ])
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    :header="title"
  >
    <slot></slot>

    <div class='buttons-container' :class="{ inverted: invertButtons }">
      <Button
        v-if="primaryButtonText"
        :label="primaryButtonText"
        @click="emit('primaryButtonClick')"
      />
  
      <Button
        v-if="secondaryButtonText"
        :label="secondaryButtonText"
        severity='danger'
        @click="emit('secondaryButtonClick')"
      />
    </div>
  </Dialog>
</template>

<style scoped>
  .buttons-container {
    display: flex;
    justify-content: space-around;
  }

  .inverted {
    flex-direction: row-reverse;
  }
</style>