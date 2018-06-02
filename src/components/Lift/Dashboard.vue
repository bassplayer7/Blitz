<template>
  <div class="dashboard">
    <lift-header/>
    <div class="timing" @click="startBreak">
      <div class="descriptor"><b>{{ completeRounds }}</b> completed</div>
      <div class="elapsed-time" :style="redColor">{{ breakElapsed }}</div>
      <button type="button" class="go" @click.stop="startBreak">Start Break</button>
    </div>

    <transition name="settings">
      <div class="duration-setting" v-if="!showActions">
        <!-- TODO: properly inline SVG -->
        <!--<img src="@/assets/icons/timer.svg" alt="Break Duration"/>-->
        <input :value="breakLimit" title="Break Duration" class="duration" @blur="updateBreakLimit" @focus="allowTimerStart = false"/>
        <span>/s</span>
      </div>
    </transition>

    <div class="actions" :class="{ 'is-active': showActions }">
      <button type="button" @click="clear" class="clear">Clear</button>
      <button type="button" @click="togglePause" class="pause">
        <span v-if="!isPaused">Pause</span>
        <span v-else>Resume</span>
      </button>
    </div>
  </div>
</template>

<script>
  import LiftHeader from "./Header";

  export default {
    components: {LiftHeader}, name: 'dashboard',
    data() {
      return {
        intervalId: null,
        rounds: [],
        timeCounter: parseInt(this.$store.state.breakLimit || 90),
        overtimeToggle: false,
        isPaused: false,
        timeRunning: false,
        allowTimerStart: true
      }
    },
    computed: {
      breakLimit() {
        return this.$store.state.breakLimit;
      },

      breakElapsed() {
          return `${this.timeCounter}s`;

          if (this.timeCounter < 60) {
              return `${this.timeCounter}s`;
          } else {
              return `${Math.floor(this.timeCounter / 60)}m ${this.timeCounter % 60}s`;
          }
      },
      showActions() {
        return this.rounds.length > 0 || this.timeCounter < this.breakLimit || this.timeRunning;
      },
      redColor() {
        const percentComplete = 1 - (this.timeCounter / this.breakLimit);
        const rFactor = Math.max(255 - ((255 - 100) * percentComplete), 100);

        return `--not-r: ${Math.round(rFactor)}`;
      },
      completeRounds() {
        const numOfRounds = this.rounds.length;
        let descriptor = 'rounds';

        if (numOfRounds === 1) {
            descriptor = 'round'
        }

        return `${numOfRounds} ${descriptor}`;
      }
    },

    watch: {
      isPaused(newValue) {
        if (newValue) document.body.classList.remove('flash');
      },

      timeCounter(newValue) {
        if (!this.isPaused && newValue < 0) {
          document.body.classList.add('flash');
        } else {
          document.body.classList.remove('flash');
        }
      }
    },

    methods: {
      updateBreakLimit(newValue) {
        this.$store.commit('updateBreakLimit', parseInt(newValue.target.value || 90));
        this.$nextTick(() => {
          this.allowTimerStart = true;
          this.timeCounter = this.breakLimit;
        });
      },
      startBreak() {
        if (!this.allowTimerStart) return;

        if (this.isPaused) {
          this.startTimer();
          this.isPaused = false;
        } else {
          this.finishRound();
          this.timeCounter = this.breakLimit;
          this.startTimer();
        }
      },
      finishRound() {
        this.rounds.push({
          dur: this.timeCounter
        })
      },
      startTimer() {
        window.clearInterval(this.intervalId);
        this.timeRunning = true;
        this.stayAwake();
        this.intervalId = window.setInterval(() => {
          this.timeCounter--;
        }, 1000);
      },

      togglePause() {
        if (this.isPaused) {
          this.startTimer();
          this.isPaused = false;
        } else {
          window.clearInterval(this.intervalId);
          this.isPaused = true;
        }
        this.allowSleep();
      },
      clear() {
        this.rounds = [];
        window.clearInterval(this.intervalId);
        this.timeRunning = false;
        this.timeCounter = this.breakLimit;
        this.allowSleep();
      },
      shutdown() {
        document.body.classList.remove('is-fixed');
        document.body.classList.remove('flash');

        this.$store.commit('updateRoundStatus', {
          transientBreak: this.timeCounter,
          rounds: this.rounds
        });
      }
    },
    beforeMount() {
      document.body.classList.add('is-fixed');
    },
    mounted() {
      const diff = Math.abs(new Date() - new Date(this.$store.state.roundTimestamp)) / (60*60*1000);

      if (this.$store.state.transientBreak && diff < 12) {
        this.timeCounter = this.$store.state.transientBreak;
        this.rounds = this.$store.state.rounds;
        this.$store.commit('clearRoundStatus');
        this.isPaused = true;
      }

      window.onunload = this.shutdown.bind(this);
    },
    beforeDestroy() {
      this.shutdown();
    }
  }
</script>

<style scoped lang="scss">
  .dashboard {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    @media screen and (orientation: landscape) {
      flex-direction: row;
    }
  }

  .timing {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 8vmin;

    @media screen and (orientation: landscape) {
      justify-content: space-between;
      padding: 5vmin 5vw 0 0;
    }
  }

  .descriptor {
    font-size: 1.5em;

    @media screen and (orientation: portrait) {
      padding-top: 1em;
    }
  }

  .go {
    width: 100%;
    background: var(--green);
    padding: 0.5em;
    font-size: 2em;

    @media screen and (orientation: landscape) {
      padding-left: env(safe-area-inset-left);

      @supports (padding-left: max(0px)) {
        padding-left: unquote('max(1em, env(safe-area-inset-left))');
      }
    }
  }

  .elapsed-time {
    font-size: 50vmin;
    color: unquote('rgb(255, var(--not-r, 255), var(--not-r, 255))');
  }

  .duration-setting {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 1 / -1;
    transform: rotateY(0deg) scale(1);
    transition: transform 300ms ease-out;
    transform-origin: left;

    @media screen and (orientation: portrait) {
      width: 100%;
      bottom: 0;
    }

    @media screen and (orientation: landscape) {
      padding: 0;
      height: 100%;
      right: 0;
    }
  }

  .settings-enter,
  .settings-leave-to {
    @media screen and (orientation: portrait) {
      transform: rotateX(-90deg) scale(0.94);
    }

    @media screen and (orientation: landscape) {
      transform: rotateY(-90deg) scale(0.94);
    }
  }

  .settings-enter-active {
    transition-delay: 200ms;
  }

  .duration-setting > img {
    margin-right: 0.5em;
    max-width: 40px;
  }

  .duration-setting > span {
    position: relative;
    left: -1.5em;
  }

  .duration {
    border: none;
    font-size: inherit;
    text-align: center;
    width: 3.5em;
    padding: 0.85em 1.25em 0.75em 0.75em;
    color: #fff;
    background-color: rgba(80, 80, 80, 1);
    border-bottom: 3px solid var(--mid-gray);
  }

  .actions {
    display: grid;
    bottom: 0;
    width: 100%;
    grid-template-columns: 3fr 5fr;
    transition: transform 300ms ease-out 100ms;

    @media screen and (orientation: portrait) {
      transform: rotateX(-90deg) translateY(-10%) scale(0.92);
    }

    @media screen and (orientation: landscape) {
      transform-origin: right;
      transform: rotateY(-90deg) translateX(-10%) scale(0.92);
      grid-template-columns: 1fr;
      width: auto;
    }
  }

  .actions.is-active {
    @media screen and (orientation: portrait) {
      transform: rotateX(0) translateY(0) scale(1);
    }

    @media screen and (orientation: landscape) {
      transform: rotateY(0) translateX(0) scale(1);
    }
  }

  .actions > button {
    display: block;

    @supports (padding-bottom: max(0px)) {
      padding-top: unquote('max(1.5em, env(safe-area-inset-top))');
      padding-bottom: unquote('max(1.5em, env(safe-area-inset-bottom))');
      padding-left: unquote('max(1.5em, env(safe-area-inset-left))');
      padding-right: unquote('max(1.5em, env(safe-area-inset-right))');
    }
  }

  .actions > :first-child {
    border-right: 2px solid var(--dark-gray);
  }

  .pause {
    background-color: rgba(255, 228, 0, 0.9);
    color: var(--dark-gray);
  }

  .clear {
    background-color: rgba(255, 255, 255, 0.05);
  }
</style>
