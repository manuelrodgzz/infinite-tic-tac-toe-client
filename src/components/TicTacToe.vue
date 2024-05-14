<script setup>
import { toRefs, computed } from 'vue'
import Cell from './Cell.vue'
import gameConfig from 'root/gameConfig.json'
import Avatar from './Avatar.vue'
import Tag from 'primevue/tag'

const props = defineProps({
  currentPlayer: Number,
  playsHistory: Array,
  cells: Array,
  enabled: {
    type: Boolean,
    default: true
  },
  players: {
    type: Object,
    required: true
  }
})

const turnTag = computed(() => {
  const playerInTurn = Object.values(props.players).find(
    (player) => player.marker === props.currentPlayer
  )

  if (!playerInTurn) return ''

  const endsWithS = playerInTurn.name[playerInTurn.name.length - 1].toLowerCase() === 's'
  return `${playerInTurn.name}'${endsWithS ? '' : 's'} turn`
})

const { cells, playsHistory, currentPlayer } = toRefs(props)

const emit = defineEmits(['stateUpdate', 'win'])

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const PLAYER_1 = 0
const PLAYER_2 = 1

function deleteFirstPlayerMoves(numberOfMovements, playsHistory, cells) {
  const cellsCopy = [...cells]
  const playsHistoryCopy = [...playsHistory]
  for (let i = 0; i < numberOfMovements; i++) {
    cellsCopy[playsHistory[currentPlayer.value][0]] = {
      ...cellsCopy[playsHistory[currentPlayer.value][0]],
      active: false
    }
    playsHistoryCopy[currentPlayer.value].shift()
  }

  return {
    cellsCopy,
    playsHistoryCopy
  }
}

function handleCellClick(cellIndex) {
  let cellsCopy = [...cells.value]
  let playsHistoryCopy = [...playsHistory.value]
  const clickedCell = cells.value[cellIndex]

  if (clickedCell.lastTouched !== null && clickedCell.active) return

  cellsCopy[cellIndex] = { lastTouched: currentPlayer.value, active: true }

  if (didWin(cellsCopy)) {
    emit('win', { cells: cellsCopy, playsHistory: playsHistoryCopy }, currentPlayer.value)
    return
  }

  if (playsHistoryCopy[currentPlayer.value].length === 6 - gameConfig.cellsToReset) {
    const updatedCellsAndHistory = deleteFirstPlayerMoves(
      gameConfig.cellsToReset,
      playsHistoryCopy,
      cellsCopy
    )

    cellsCopy = updatedCellsAndHistory.cellsCopy
    playsHistoryCopy = updatedCellsAndHistory.playsHistoryCopy
  }

  playsHistoryCopy[currentPlayer.value].push(cellIndex)
  emit('stateUpdate', {
    cells: cellsCopy,
    playsHistory: playsHistoryCopy,
    currentPlayer: currentPlayer.value ? PLAYER_1 : PLAYER_2
  })
}

function didWin(updatedCells) {
  for (const combination of WINNING_COMBINATIONS) {
    const won = combination.every((cellIndex) => {
      return (
        updatedCells[cellIndex].active &&
        updatedCells[cellIndex].lastTouched === currentPlayer.value
      )
    })

    if (won) return true
  }

  return false
}
</script>

<template>
  <div class="game">
    <div class="turn-tag-container">
      <Tag v-if="turnTag" severity="contrast" :value="turnTag" />
    </div>

    <div class="avatars">
      <div
        v-for="(player, id) in players"
        :key="`avatar-${id}`"
        class="player"
        :class="{ times: player.marker === 0, circle: player.marker === 1 }"
      >
        <Avatar :player show-is-connected />
        <span class="wins">{{ player.wins }}</span>
      </div>
    </div>

    <div class="tic-tac-toe">
      <Cell
        v-for="(cell, cellIndex) in cells"
        v-bind="cell"
        :key="`cell-${cellIndex}`"
        :enabled
        @click="enabled && handleCellClick(cellIndex)"
      />
    </div>
  </div>
</template>

<style scoped>
.game {
  align-self: center;
}

.turn-tag-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.tic-tac-toe {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 0 auto;
  width: 300px;
  height: 300px;
}

.avatars {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.avatars .player {
  position: relative;
  text-align: center;
}

.avatars .player span {
  display: block;
}

.times .wins {
  color: rgb(57, 177, 247);
}

.circle .wins {
  color: rgb(255, 73, 73);
}

@media screen and (min-width: 768px) {
  .tic-tac-toe {
    width: 400px;
    height: 400px;
  }
}
</style>
