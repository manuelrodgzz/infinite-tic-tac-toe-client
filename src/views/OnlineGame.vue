<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import useGameState from '@/hooks/useGameState'
import TicTacToe from '@/components/TicTacToe.vue'
import Socket from '@/utils/socket.js'
import PlayerId from '@/utils/playerId.js'
import Lobby from '@/components/Lobby.vue'
import useNotification from '@/hooks/useNotification.js'
import WaitingForResponse from '@/components/WaitingForResponse.vue'
import PlayAgainModal from '@/components/Modal/PlayAgain.vue'
import Layout from '@/layout/Index.vue'
import AbandonWrapper from '@/components/AbandonWrapper.vue'

const router = useRouter()
const { cells, playsHistory, currentPlayer, lastWinnerId, players, currentPlayerMarker } =
  useGameState()
const notification = useNotification()

const showWaitingScreen = ref(false)
const showPlayAgain = ref(false)
const showOponentAbandoned = ref(true)

const matchId = router.currentRoute.value.params.matchId

const playerId = PlayerId.get()

const playersArr = computed(() => {
  return Object.entries(players.value).map(([id, data]) => ({ id, ...data }))
})

const showTicTacToe = computed(() => {
  const arePlayersReady =
    playersArr.value.length > 1 && playersArr.value.every((player) => player.isReady)

  const isNotTheFirstMatch = playersArr.value.some((player) => player.wins)

  return arePlayersReady || (isNotTheFirstMatch && !players.value[playerId].isReady)
})

// Check if should show waiting screen
watch(playersArr, (newValue, oldValue) => {
  let isNotTheFirstMatch = false
  let allPlayersReady = true
  let somePlayersAreReady = false

  newValue.forEach((player) => {
    if (player.wins) {
      isNotTheFirstMatch = true
    }

    if (!player.isReady) {
      allPlayersReady = false
    } else {
      somePlayersAreReady = true
    }

    // If current player is oponent
    if (player.id !== playerId) {
      const oldOponent = oldValue.find((oldPlayer) => player.id === oldPlayer.id)

      if (!oldOponent) return

      if (!oldOponent.disconnected && player.disconnected) {
        notification.warn({
          summary: `${player.name} lost connection.`
        })
      }

      if (oldOponent.disconnected && !player.disconnected) {
        notification.success({
          summary: `${player.name} is back online.`
        })
      }
    }
  })

  if (isNotTheFirstMatch) {
    if (allPlayersReady) {
      showWaitingScreen.value = false
      return
    }

    if (somePlayersAreReady) {
      showWaitingScreen.value = true
    }
  }
})

watch(currentPlayer, (newVal, prev) => {
  if (newVal !== prev) {
    handleStateUpdate()
  }
})

function updateMatchState(updatedMatch) {
  cells.value = updatedMatch.cells
  playsHistory.value = updatedMatch.playsHistory
  currentPlayer.value = updatedMatch.currentPlayer
  players.value = updatedMatch.players
  lastWinnerId.value = updatedMatch.lastWinnerId
}

function getEmitableGameState() {
  return {
    cells: cells.value,
    playsHistory: playsHistory.value,
    currentPlayer: currentPlayer.value,
    lastWinnerId: lastWinnerId.value
  }
}

function handleStateUpdate() {
  Socket.instance.emit('match:play', matchId, getEmitableGameState())
}

function handleWin() {
  lastWinnerId.value = playerId
  Socket.instance.emit('match:win', matchId, getEmitableGameState(), playerId)
}

function matchDisconnect() {
  Socket.instance.emit('player:room:leave', matchId, playerId)
  const param = showOponentAbandoned.value ? '?oponentAbandoned=true' : ''
  router.push(`/online${param}`)
}

function emitPlayAgainDecision(wantsToPlayAgain) {
  Socket.instance.emit('match:rematch', matchId, playerId, wantsToPlayAgain)

  if (!wantsToPlayAgain) {
    matchDisconnect()
  }
}

function handlePlayAgain(decision) {
  if (!decision) {
    showOponentAbandoned.value = false
  }

  emitPlayAgainDecision(decision)
  showPlayAgain.value = false
}

function handleAbandon() {
  showOponentAbandoned.value = false
  emitPlayAgainDecision(false)
}

Socket.connect()

Socket.instance
  .timeout(5000)
  .emitWithAck('match:lobby', matchId, playerId)
  .then((res) => {
    if (res.error) {
      notification.error({
        summary: res.error
      })

      setTimeout(() => {
        router.push('/online')
      }, 2_000)
    }
  })

Socket.instance.on('match:update', (updates) => {
  updateMatchState(updates)
})

Socket.instance.on('match:end', async (updatedMatch, winnerId) => {
  lastWinnerId.value = winnerId
  updateMatchState(updatedMatch)
  showPlayAgain.value = true
})

Socket.instance.on('match:reset', (newMatch) => {
  updateMatchState(newMatch)
})

Socket.instance.on('match:exit', () => {
  matchDisconnect()
})
</script>

<template>
  <Layout :show-nav="false">
    <AbandonWrapper @abandon="handleAbandon">
      <TicTacToe
        v-if="showTicTacToe"
        :enabled="currentPlayer === playerId"
        v-model:cells="cells"
        v-model:plays-history="playsHistory"
        v-model:current-player="currentPlayer"
        :players
        :current-player-marker="currentPlayerMarker"
        @win="handleWin"
      />
      <WaitingForResponse
        v-else-if="showWaitingScreen"
        :oponent-player="Object.entries(players).find(([id, player]) => id !== playerId)[1]"
      />
      <Lobby v-else :matchId="matchId" :players />

      <PlayAgainModal
        :visible="showPlayAgain"
        :winner="players[lastWinnerId]?.name"
        @yes="handlePlayAgain(true)"
        @no="handlePlayAgain(false)"
      />
    </AbandonWrapper>
  </Layout>
</template>
