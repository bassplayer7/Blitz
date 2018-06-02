<template>
    <header>
        <router-link to="/" class="logo" @click.stop>J</router-link>
    </header>
</template>

<script>
    export default {
      name: 'lift-header',
      data() {
        return {}
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
</style>