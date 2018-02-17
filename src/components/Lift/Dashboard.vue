<template>
  <div class="dashboard">
    <header>
      <router-link to="/" class="logo" @click.stop>J</router-link>
    </header>
    <div class="timing" @click="startBreak">
      <div class="descriptor"><b>{{ completeRounds }}</b> completed</div>
      <div class="elapsed-time" :style="redColor">{{ breakElapsed }}</div>
      <button type="button" class="go" @click.stop="startBreak">Start Break</button>
    </div>
    <div class="actions">
      <div class="duration-setting">
        <!-- TODO: properly inline SVG -->
        <!--<img src="@/assets/icons/timer.svg" alt="Break Duration"/>-->
        <input v-model="breakLimit" title="Break Duration" class="duration"/>
        <span>/s</span>
      </div>
      <button type="button" @click="clear" class="clear">Clear</button>
      <button type="button" @click="togglePause" class="pause"><span v-if="!isPaused">Pause</span><span v-else>Resume</span></button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
    name: 'dashboard',
    data() {
      return {
        intervalId: null,
        breakLimit: 90,
        rounds: [],
        timeCounter: 90,
        overtimeToggle: false,
        isPaused: false
      }
    },
    computed: {
      breakElapsed() {
          return `${this.timeCounter}s`;

          if (this.timeCounter < 60) {
              return `${this.timeCounter}s`;
          } else {
              return `${Math.floor(this.timeCounter / 60)}m ${this.timeCounter % 60}s`;
          }
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

    methods: {
      startBreak() {
        this.finishRound();
        window.clearInterval(this.intervalId);
        this.timeCounter = this.breakLimit;
        this.startTimer();
      },
      finishRound() {
        this.rounds.push({
          dur: this.timeCounter
        })
      },
      startTimer() {
        window.clearInterval(this.intervalId);
        this.stayAwake();
        this.intervalId = window.setInterval(() => {
          this.timeCounter--;

          if (this.timeCounter < 0) this.flash();
        }, 1000);
      },
      flash() {
        this.overtimeToggle = !this.overtimeToggle;

        if (this.overtimeToggle) {
            document.body.classList.add('flash');
        } else {
          document.body.classList.remove('flash');
        }
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
        this.timeCounter = this.breakLimit;
        this.allowSleep();
      }
    },
    beforeDestroy() {
      window.clearInterval(this.intervalId);
    }
  }
</script>

<style scoped lang="scss">
  header {
    position: fixed;
    top: 0.5em;
    left: 0.5em;
  }

  .logo {
    color: var(--light-gray);
    text-shadow: 0 0 25px rgba(255, 255, 255, 1);
    background-color: rgba(255,255,255,0.3);
    width: 1.4em;
    height: 1.4em;
    padding-top: 0.2em;
    border: 2px solid var(--light-gray);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3) inset;
    border-radius: 50%;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    animation: flash-logo 900ms ease-in-out;
    animation-fill-mode: forwards;
  }

  @keyframes flash-logo {
    0% {
      text-shadow: 0 0 25px rgba(255, 255, 255, 1);
      background-color: rgba(255,255,255,0.3);
    }
    100% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
      background-color: rgba(255,255,255,0.05);
    }
  }

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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 1 / -1;
    padding-bottom: 8vmin;
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

    @media screen and (orientation: landscape) {
      grid-template-columns: 1fr;
      width: auto;
    }
  }

  .actions > button {
    display: block;

    @supports (padding-bottom: max(0px)) {
      padding-top: unquote('max(1em, env(safe-area-inset-bottom))');
      padding-bottom: unquote('max(1em, env(safe-area-inset-bottom))');
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
