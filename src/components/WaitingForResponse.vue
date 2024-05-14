<script setup>
import { computed } from 'vue'
import Avatar from './Avatar.vue'

const props = defineProps({
  oponentPlayer: Object,
  default: {}
})

const nameEndsWithS = computed(() => {
  const lastNameIndex = props.oponentPlayer.name.length - 1
  return props.oponentPlayer.name[lastNameIndex].toLowerCase() === 's'
})
</script>

<template>
  <section>
    <div class="avatar-container">
      <Avatar :player="oponentPlayer" show-is-connected />
      <span>Waiting for {{ oponentPlayer.name }}'{{ !nameEndsWithS ? 's' : '' }} response...</span>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container span {
  display: block;
  margin-top: 1rem;
}
</style>
