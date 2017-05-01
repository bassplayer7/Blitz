<template>
  <div id="app">
    <h1>Vue Blitz</h1>
    <ul>
      <game-player v-for="(player, index) in players" v-bind:player="player" v-bind:index="index" v-bind:key="player" v-on:remove="deletePlayer(index)"></game-player>
    </ul>
    <button v-on:click="newPlayer">Create Player</button>
  </div>
</template>

<script>
  import Player from './Components/Player.vue';

export default {
  data () {
    return {
      counter: 0,
      colors: ['blue', 'orange', 'yellow', 'green'],
      players: [
          { name: 'Jesse' },
          { name: 'Bob' }
      ],
    }
  },
  methods: {
      increment: function () {
          this.counter += 1;
          this.$emit('increment');
      },
      newPlayer: function () {
          this.players.push({});
          this.increment();
      },

      deletePlayer: function (index) {
          let player = this.players.splice(index, 1);
          this.$emit('player-deleted', player);
          this.counter -= 1;
      },
      getColor(index) {
          let accessKey = index || this.counter;
          return this.colors[accessKey % this.colors.length];
      },

      getNextColor(color) {
          const currentPos = this.colors.indexOf(color);
          return this.colors[(currentPos + 1) % this.colors.length];
      }
  },
  components: {
      'game-player': Player
  }
}
</script>

<style lang="scss">
  @import "./assets/scss/core";

  body {
    font: 16px/1.5 var(--font-family-sans);
  }


  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    max-width: 20rem;
    margin: 2rem auto;
  }

  h1, h2 {
    font-weight: normal;
    text-align: center;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
</style>
