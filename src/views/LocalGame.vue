<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TicTacToe from '@/components/TicTacToe.vue'
import useGameState from '@/hooks/useGameState'
import PlayAgainModal from '@/components/Modal/PlayAgain.vue'
import Layout from '@/layout/Index.vue'
import AbandonWrapper from '@/components/AbandonWrapper.vue'

const PLAYERS_DATA = {
  0: {
    name: 'X',
    marker: 0,
    wins: 0
  },
  1: {
    name: 'O',
    marker: 1,
    wins: 0
  }
}

const {
  cells,
  playsHistory,
  currentPlayer,
  resetGame,
  lastWinnerId,
  players,
  currentPlayerMarker
} = useGameState(PLAYERS_DATA, true)
const router = useRouter()

const showPlayAgain = ref(false)

async function handleWin(winnerMarker) {
  players.value[winnerMarker].wins++
  showPlayAgain.value = true
  lastWinnerId.value = winnerMarker
}

function handlePlayAgain(wantsToPlayAgain) {
  showPlayAgain.value = false

  if (wantsToPlayAgain) {
    resetGame()
    return
  }

  router.push('/')
}
</script>

<template>
  <Layout :show-nav="false">
    <AbandonWrapper to="/">
      <TicTacToe
        v-model:cells="cells"
        v-model:playsHistory="playsHistory"
        v-model:currentPlayer="currentPlayer"
        :players
        :current-player-marker="currentPlayerMarker"
        @win="handleWin"
      />

      <PlayAgainModal
        :visible="showPlayAgain"
        :winner="players[lastWinnerId]?.name"
        @yes="handlePlayAgain(true)"
        @no="handlePlayAgain(false)"
      />
    </AbandonWrapper>
  </Layout>
</template>
