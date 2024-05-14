<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import AbandonConfirmModal from '@/components/Modal/AbandonConfirm.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  to: String
})

const router = useRouter()

const showAbandonConfirm = ref(false)

const emit = defineEmits(['abandon'])

function handleAbandon(abandon) {
  showAbandonConfirm.value = false

  if (abandon) {
    emit('abandon')

    if (props.to) {
      router.push(props.to)
    }
  }
}
</script>

<template>
  <section>
    <Button
      label="Abandon"
      icon="pi pi-sign-out"
      severity="danger"
      @click="showAbandonConfirm = true"
    />

    <div class="game-wrapper">
      <slot></slot>
    </div>
  </section>

  <AbandonConfirmModal
    :visible="showAbandonConfirm"
    @abandon="handleAbandon(true)"
    @cancel="handleAbandon(false)"
  />
</template>

<style scoped>
section {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.game-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  align-self: flex-start;
}
</style>
