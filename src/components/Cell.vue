<script setup>
import { watch, reactive } from 'vue'
import gameConfig from 'root/gameConfig.json'

const isDev = import.meta.env.DEV

const props = defineProps({
  lastTouched: Number,
  active: Boolean,
  enabled: Boolean,
  cellIndex: Number
})

const spanClasses = reactive(getClassesFromProps(props))

function getClassesFromProps(propsObj) {
  return {
    'fade-out': !propsObj.active && propsObj.lastTouched !== null,
    'fade-in': propsObj.active,
    circle: propsObj.lastTouched === 1,
    times: propsObj.lastTouched === 0
  }
}

function removeClassWithDelay(className) {
  setTimeout(() => (spanClasses[className] = false), gameConfig.animationDuration)
}

watch(props, (newProps) => {
  const newClassesObj = getClassesFromProps(newProps)
  spanClasses['fade-out'] = newClassesObj['fade-out']
  spanClasses['fade-in'] = newClassesObj['fade-in']
  spanClasses['circle'] = newClassesObj.circle
  spanClasses['times'] = newClassesObj.times

  if (spanClasses['fade-out']) {
    if (spanClasses['times']) {
      removeClassWithDelay('times')
    } else {
      removeClassWithDelay('circle')
    }
  }
})
</script>

<template>
  <div class="cell" :class="{ disabled: !enabled }">
    <span v-if="isDev" class="dev-index">{{ cellIndex }}</span>
    <span
      class="icon"
      :class="spanClasses"
      :style="{ animationDuration: gameConfig.animationDuration }"
    ></span>
  </div>
</template>

<style scoped>
.cell {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  min-height: 30px;
}

.cell:hover {
  cursor: pointer;
}

.cell.disabled:hover {
  cursor: initial;
}

.cell .icon {
  min-width: 100%;
  min-height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  transition: all;
  transition-duration: 400ms;
  opacity: 0;
}

.icon.fade-out {
  opacity: 0;
}

.icon.fade-in {
  opacity: 1;
}

.times {
  background: url(/src/assets/times.svg);
}

.circle {
  background: url(/src/assets/circle.svg);
}

.dev-index {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
