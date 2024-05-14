import { ref } from 'vue'

function useGameState(isLocalGame = false) {
  const playsHistory = ref([[], []])
  const cells = ref(new Array(9).fill({ lastTouched: null, active: false }))
  const currentPlayer = ref(0)

  function resetGame() {
    cells.value = new Array(9).fill({ lastTouched: null, active: false })
    playsHistory.value = [[], []]
    currentPlayer.value = 0
  }

  return {
    playsHistory,
    cells,
    currentPlayer,
    resetGame: isLocalGame ? resetGame : undefined
  }
}

export default useGameState
