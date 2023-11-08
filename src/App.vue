<template>
  <div id="app">
      <Nav></Nav>
      <router-view />
  </div>
</template>

<script>
import Nav from './components/Nav.vue'

export default {
  components: {
      Nav
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');


html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: #F2F2F0;
  font-family: 'Montserrat', sans-serif; /* Set Montserrat as the default font */
}

* {
  box-sizing: border-box;
}
</style>
