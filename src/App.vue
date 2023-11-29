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
  background-image: url('~@/assets/background-image.jpg'); /* Sets the background image */
  background-color: #F2F2F0; /* Sets the background color */
  background-size: auto; /* Sets the height of the background image to 1000px */
  background-position: center; /* Centers the background image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  font-family: 'Montserrat', sans-serif; /* Set Montserrat as the default font */
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
