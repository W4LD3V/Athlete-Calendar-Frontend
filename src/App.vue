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
  background-image: url('~@/assets/background-image.jpg');
  background-color: #F2F2F0;
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
  font-family: 'Montserrat', sans-serif;
}

* {
  box-sizing: border-box;
}

.white-title {
    color: #ecf0f1;
  }

  @media (max-width: 768px) {
  html, body, #app {
    
  }
}
</style>
