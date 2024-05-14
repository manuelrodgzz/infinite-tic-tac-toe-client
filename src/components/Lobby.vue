<script setup>
  import PlayerId from '@/utils/playerId.js'
  import Socket from '@/utils/socket.js'
  import Avatar from '@/components/Avatar.vue'
  import Button from 'primevue/button'
  import useNotification from '@/hooks/useNotification.js'

  Socket.connect()
  const notification = useNotification()
  const playerId = PlayerId.get()
  console.log('Found playerId:', playerId)

  const props = defineProps({
    players: {
      default: {},
      type: Object
    },
    matchId: {
      type: String,
      required: true
    }
  })

  function toggleIsReady() {
    Socket.instance.emit('match:player:toggleReady', props.matchId, playerId)
  }

  function getPlayerStatus(player) {
    return player.isReady ? 'Not ready' : 'Ready'
  }

  function copyMatchId() {
    navigator.clipboard.writeText(props.matchId).then(() => {
      notification.success({
        summary: 'Match ID copied to clipboard.',
        life: 1_000
      })
    })
  }
</script>

<template>
  <div class='container'>
    <ul>
      <li v-for="(player, id) in players">
        <div class='player-container'>
          <Avatar :player show-is-ready/>

          <span class='player-name'>{{player.name}}</span>
        </div>
        
        <Button
          v-if="id === playerId"
          :severity="player.isReady ? 'danger' : 'success'"
          @click="toggleIsReady"
        >
          {{  getPlayerStatus(player)  }}
        </Button>
  
      </li>
    </ul>

    <Button
      class='copy'
      icon='pi pi-clipboard'
      @click="copyMatchId"
      label='Copy match ID'
    />
  </div>
</template>

<style scoped>
  .container {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .player-container {
    display: flex;
    align-items: center;
  }

  ul {
    width: 100%;
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-bottom: 2rem;
  }

  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .player-name {
    margin: 0 1rem;
  }

  @media screen and (min-width: 768px) {
    .container {
      width: 50%;
    }
  }
</style>