<template>
  <div class="content">
    <p>These apps are intended to make things just a little easier. Tracking scores when playing games like Dutch Blitz&reg; always seemed to involve one person spending a good deal of time writing scores down and then adding everything up. The Card Game Scores app allows you to track score for every round and player. You can change the color of each player to correspond to their card deck as well. The color resemble those of Dutch Blitz&reg; so if you happen to be playing that game, you can easily align the colors.</p>

    <p>The lift app is intended to measure the duration of breaks between sets when lifting weights. The idea is to have breaks that do not extend beyond a specified duration. Many apps that I found on the App Store are more complicated than I needed and tracked set time and rep count and such. The problem is that these aspects made it more cumbersome to use them and I would just write down the times on a whiteboard. I then had to frequently check the time on the whiteboard against the clock. This was by no means difficult, but I decided to write this app to see if I would actually find it helpful.</p>

    <p>In addition, these apps have been an opportunity to hone or put into practice my front end Javascript capabilities. The Card Game Score app was built with Knockout.js - perhaps one of the first frameworks built with the reactive concepts.  While Knockout.js has been eclipsed by other reactive Javascript frameworks, and for good reason, it is used in Magento 2 some, so it seemed like a logical choice for learning the framework.</p>

    <p>The lift tracking app was built with Vue.js.</p>

    <p>This app is not at all affiliated with or sponsored by Dutch Blitz&reg; or any other company.</p>
  </div>
</template>

<script>
  export default {
    name: 'welcome-text',
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .content {
    margin: 4vmin auto;
    max-width: 680px;
    text-align: left;
    font-size: 20px;
    font-family: "Merriweather", serif;
    line-height: 1.55;
    padding: 1em;
  }

  @media (max-width: 600px) {
    .content {
      font-size: 18px;
    }
  }

  p {
    margin-bottom: 1.25em;
  }
</style>
