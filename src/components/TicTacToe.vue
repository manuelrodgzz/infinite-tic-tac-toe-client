<script setup>
import { computed, defineModel } from 'vue'
import Cell from './Cell.vue'
import gameConfig from 'root/gameConfig.json'
import Avatar from './Avatar.vue'
import Tag from 'primevue/tag'

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

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true
  },
  players: {
    type: Object,
    required: true
  },
  currentPlayerMarker: Number
})

const currentPlayer = defineModel('currentPlayer', { required: true })
const playsHistory = defineModel('playsHistory', { required: true })
const cells = defineModel('cells', { required: true })

const turnTag = computed(() => {
  const playerInTurn = Object.values(props.players).find(
    (player) => player.marker === props.players[currentPlayer.value]?.marker
  )

  if (!playerInTurn) return ''

  const endsWithS = playerInTurn.name[playerInTurn.name.length - 1].toLowerCase() === 's'
  return `${playerInTurn.name}'${endsWithS ? '' : 's'} turn`
})

const tagColor = computed(() => {
  return props.currentPlayerMarker === 0 ? 'info' : 'danger'
})

const emit = defineEmits(['win'])

function deleteFirstPlayerMoves(numberOfMovements) {
  for (let i = 0; i < numberOfMovements; i++) {
    cells.value[playsHistory.value[props.currentPlayerMarker][0]] = {
      ...cells.value[playsHistory.value[props.currentPlayerMarker][0]],
      active: false
    }
    playsHistory.value[props.currentPlayerMarker].shift()
  }
}

function handleCellClick(cellIndex) {
  const clickedCell = cells.value[cellIndex]

  if (clickedCell.lastTouched !== null && clickedCell.active) return

  cells.value[cellIndex] = { lastTouched: props.currentPlayerMarker, active: true }

  if (didWin()) {
    emit('win', props.currentPlayerMarker)
    return
  }

  if (playsHistory.value[props.currentPlayerMarker].length === 6 - gameConfig.cellsToReset) {
    deleteFirstPlayerMoves(gameConfig.cellsToReset)
  }

  playsHistory.value[props.currentPlayerMarker].push(cellIndex)
  const [oponentId] = Object.entries(props.players).find(
    ([id]) => String(id) !== String(currentPlayer.value)
  )

  currentPlayer.value = oponentId
}

function didWin() {
  for (const combination of WINNING_COMBINATIONS) {
    const won = combination.every((cellIndex) => {
      return (
        cells.value[cellIndex].active &&
        cells.value[cellIndex].lastTouched === props.currentPlayerMarker
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
      <Tag v-if="turnTag" :severity="tagColor" :value="turnTag" />
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
        :cell-index="cellIndex"
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
