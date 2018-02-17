<template>
  <div>
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
    <welcome-text/>
    <footer>
      &copy; Copyright {{ year }} Jesse Maxwell
    </footer>
  </div>
</template>

<script>
  import LiftIcon from '@/assets/icons/lift.svg';
  import MedalIcon from '@/assets/icons/medal.svg';
  import WelcomeText from "./WelcomeText";
  export default {
    name: 'home',
    components: {
      WelcomeText,
      LiftIcon,
      MedalIcon
    },
    data() {
      return {}
    },
    computed: {
      year() {
        return (new Date()).getFullYear()
      },
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
    font-size: 10vmin;
    padding: 4vmin 0;

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

    @media screen and (min-width: 1000px), (min-height: 1000px) {
      font-size: 5rem;
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
    font-size: 11vmin;
    padding: 1em;

    @media screen and (orientation: landscape) {
      height: 100vh;
      width: 40vw;
    }

    @media screen and (min-width: 1000px), (min-height: 1000px) {
      font-size: 4rem;
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
    font-size: 5vmin;
    opacity: 0.7;
    margin-top: 0.4em;

    @media screen and (min-width: 1000px), (min-height: 1000px) {
      font-size: 2rem;
    }
  }

  footer {
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
