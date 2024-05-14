<script setup>
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'

const model = defineModel({ required: true })
const nameMaxLength = 10
</script>

<template>
  <FloatLabel>
    <InputText
      id="playerName"
      type="text"
      v-model="model"
      autocomplete="off"
      aria-describedby="name-help"
      :maxlength="nameMaxLength"
    />
    <label for="playerName">Name</label>
  </FloatLabel>
  <small id="name-help">Maximum {{ nameMaxLength }} characaters</small>
</template>

<style scoped>
small {
  display: block;
}
</style>
