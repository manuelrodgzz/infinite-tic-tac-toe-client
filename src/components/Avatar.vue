<script setup>
  import Avatar from 'primevue/avatar'

  const props = defineProps({
    player: Object,
    showIsReady: Boolean,
    showIsConnected: Boolean
  })

  function getClasses(player) {

    return {
      'times-background': player.marker === 0,
      'circle-background': player.marker === 1,
      'disconnected': props.showIsConnected && player.disconnected
    }
  }
</script>

<template>
  <template v-if="showIsReady">
    <Avatar
      v-if="player.isReady"
      :label="player.name[0].toUpperCase()"
      size='large'
      shape='square'
      v-badge.success
      :class="getClasses(player)"
    />
    <Avatar
      v-else
      :label="player.name[0].toUpperCase()"
      size='large'
      shape='square'
      v-badge.danger
      :class="getClasses(player)"
    />
  </template>

  <Avatar
    v-else
    :label="player.name[0].toUpperCase()"
    size='large'
    shape='square'
    :class="getClasses(player)"
  />
</template>

<style scoped>
  .disconnected {
    opacity: .3;
  }
</style>