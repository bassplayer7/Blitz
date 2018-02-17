<template>
  <div class="home">
    <h1>Jesse Maxwell</h1>
    <a href="/score/" class="card score">
      <medal-icon class="icon"/>
      <div class="label">Card Game Scores</div>
      <p>The convenient way to count score.</p>
    </a>
    <router-link :to="{ name: 'lift' }" class="card lift">
      <lift-icon class="icon"/>
      <div class="label">Weight Lifting Timer</div>
      <p>Easily track breaks.</p>
    </router-link>
  </div>
</template>

<script>
  import LiftIcon from '@/assets/icons/lift.svg';
  import MedalIcon from '@/assets/icons/medal.svg';
  export default {
    name: 'home',
    components: {
      LiftIcon,
      MedalIcon
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="scss">
  .home {
    display: flex;
    flex-direction: column;
    min-height: 100%;

    @media screen and (orientation: landscape) {
      flex-direction: row;
      align-items: stretch;
    }
  }

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    font-size: 13vmin;

    @media screen and (orientation: landscape) {
      align-items: flex-start;
      max-width: 20vw;
      min-width: 6ex;
      text-align: left;
      padding: 0.5em 0.2em;
      padding-left: env(safe-area-inset-left);

      @supports (padding-left: max(0px)) {
        padding-left: unquote('max(0.2em, env(safe-area-inset-left))');
      }
    }
  }

  .card {
    height: 40vh;
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;
    font-size: 10vmin;
    padding: 1em;

    @media screen and (orientation: landscape) {
      height: 100vh;
      width: 40vw;
    }
  }

  .score {
    background-color: rgb(253, 216, 53);
    color: #363636;
    margin-bottom: 4vmin;

    @media screen and (orientation: landscape) {
      margin-right: 4vmin;
      margin-bottom: 0;
    }
  }

  .lift {
    background-color: #14A76C;
  }

  .icon {
    height: 20vmin;
    width: 20vmin;
  }

  p {
    font-size: 1rem;
    opacity: 0.7;
    margin-top: 0.4em;
  }
</style>
