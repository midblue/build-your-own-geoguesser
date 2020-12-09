<template>
  <div class="main">
    <div v-if="currentGameIndex === null" class="buttons">
      <button
        v-for="(p, index) in polygons"
        :key="p.name"
        @click="startGame(index)"
      >
        {{ p.name }}
      </button>
    </div>
    <Game :polygon="polygons[currentGameIndex].polygon" v-else />
  </div>
</template>

<script>
const polygons = require('./polygons')
import Game from './components/Game'

export default {
  components: { Game },
  data() {
    return {
      polygons,
      currentGameIndex: null,
    }
  },
  methods: {
    startGame(i) {
      this.currentGameIndex = i
    },
  },
}
</script>

<style>
html,
body {
  margin: 0;
  font-family: 'Avenir', sans-serif;
  min-height: 100vh;
}

.main {
  height: 100vh;
}

.buttons {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
button {
  width: 300px;
  height: 50px;
}
</style>
