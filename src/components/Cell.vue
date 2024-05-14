<script setup>
  import { watch, reactive } from 'vue'
  import gameConfig from 'root/gameConfig.json'

  const props = defineProps({
    lastTouched: Number,
    active: Boolean,
    enabled: Boolean,
  })

  const spanClasses = reactive(getClassesFromProps(props))

  function getClassesFromProps(propsObj) {
    return {
      'fade-out': !propsObj.active && propsObj.lastTouched !== null,
      'fade-in': propsObj.active,
      'circle': propsObj.lastTouched === 1,
      'times': propsObj.lastTouched === 0,
    }
  }

  function removeClassWithDelay(className) {
    setTimeout(() => spanClasses[className] = false, gameConfig.animationDuration)
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
  <div class="cell" :class="{disabled: !enabled}">
    <span :class="spanClasses" :style="{animationDuration: gameConfig.animationDuration}">
    </span>
  </div>
</template>

<style scoped>
  .cell {
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

  .cell span {
    min-width: 100%;
    min-height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    transition: all;
    transition-duration: 400ms;
    opacity: 0;
  }

  span.fade-out {
    opacity: 0;
  }

  span.fade-in {
    opacity: 1;
  }

  .times {
    background: url(/src/assets/times.svg);
  }

  .circle {
    background: url(/src/assets/circle.svg);
  }
</style>