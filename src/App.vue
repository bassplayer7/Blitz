<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style src="@/styles/lib/reset.css"></style>
<style src="@/styles/global.scss" lang="scss"></style>

<style>
  @import url(https://fonts.googleapis.com/css?family=Teko|Merriweather);

  body, html {
    height: 100%;
    margin: 0;
  }

#app {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
