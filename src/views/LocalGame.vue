<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TicTacToe from '@/components/TicTacToe.vue'
import useGameState from '@/hooks/useGameState'
import PlayAgainModal from '@/components/Modal/PlayAgain.vue'
import Layout from '@/layout/Index.vue'
import AbandonWrapper from '@/components/AbandonWrapper.vue'

const { cells, playsHistory, currentPlayer, resetGame } = useGameState(true)
const router = useRouter()

const players = ref({
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
})
const showPlayAgain = ref(false)
const winner = ref()

function handleStateUpdate(newState, winnerMarker) {
  playsHistory.value = newState.playsHistory ?? playsHistory.value
  cells.value = newState.cells ?? cells.value
  currentPlayer.value = newState.currentPlayer ?? currentPlayer.value

  if (winnerMarker !== undefined) {
    players.value[winnerMarker].wins++
  }
}

async function handleWin(newState, winnerMarker) {
  handleStateUpdate(newState, winnerMarker)
  showPlayAgain.value = true
  winner.value = winnerMarker
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
        :cells
        :playsHistory
        :currentPlayer
        :players
        @state-update="handleStateUpdate"
        @win="handleWin"
      />

      <PlayAgainModal
        :visible="showPlayAgain"
        :winner
        @yes="handlePlayAgain(true)"
        @no="handlePlayAgain(false)"
      />
    </AbandonWrapper>
  </Layout>
</template>
