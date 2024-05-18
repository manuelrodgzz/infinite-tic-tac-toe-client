import { ref, computed } from 'vue'

function useGameState(defaultPlayers = {}, isLocalGame = false) {
  const initialPlayer = Object.entries(defaultPlayers).find(([, player]) => player?.marker === 0)
  const initialPlayerId = initialPlayer ? initialPlayer[0] : undefined

  const playsHistory = ref([[], []])
  const cells = ref(new Array(9).fill({ lastTouched: null, active: false }))
  const players = ref(defaultPlayers)
  const currentPlayer = ref(initialPlayerId)
  const lastWinnerId = ref()

  const currentPlayerMarker = computed(() => {
    return players.value[currentPlayer.value]?.marker
  })

  function resetGame() {
    cells.value = new Array(9).fill({ lastTouched: null, active: false })
    playsHistory.value = [[], []]
    currentPlayer.value = lastWinnerId.value
  }

  return {
    playsHistory,
    cells,
    currentPlayer,
    lastWinnerId,
    players,
    currentPlayerMarker,
    resetGame: isLocalGame ? resetGame : undefined
  }
}

export default useGameState
