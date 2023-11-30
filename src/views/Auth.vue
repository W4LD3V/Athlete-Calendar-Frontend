<template>
  <div class="container">
    <div class="left-side">
      <div class="logo-container">
        <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9H21M7 3V5M17 3V5M11.9976 12.7119C11.2978 11.9328 10.1309 11.7232 9.25414 12.4367C8.37738 13.1501 8.25394 14.343 8.94247 15.1868C9.33119 15.6632 10.2548 16.4983 10.9854 17.1353C11.3319 17.4374 11.5051 17.5885 11.7147 17.6503C11.8934 17.703 12.1018 17.703 12.2805 17.6503C12.4901 17.5885 12.6633 17.4374 13.0098 17.1353C13.7404 16.4983 14.664 15.6632 15.0527 15.1868C15.7413 14.343 15.6329 13.1426 14.7411 12.4367C13.8492 11.7307 12.6974 11.9328 11.9976 12.7119ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1>Athlete Calendar</h1>
      </div>
    </div>
        <LoginForm v-if="isLogin" />
        <SignupForm v-else />
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import LoginForm from '../components/LoginForm.vue';
  import SignupForm from '../components/SignupForm.vue';
  
  export default {
    components: {
      LoginForm,
      SignupForm
    },
    setup() {
      const route = useRoute();
      const isLogin = computed(() => route.name === 'Login');
  
      return {
        isLogin
      };
    }
  };
  </script>
  
  <style>
.container {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
}

.left-side {
  flex: 1; 
  background-color: #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; 
}

.logo-container {
  text-align: center;
}

.right-side {
  flex: 1; 
  background-color: #F2F2F0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  max-width: 420px;
  margin: 0;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Montserrat', sans-serif;
}

.login-button {
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: 'Montserrat', sans-serif;
}

.login-button:hover {
  background-color: #c0392b;
}

.input-container{
  margin-bottom: 30px;
}

.button-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 12px;
  gap: 20px;
}

.button-container span {
  text-decoration: underline;
}

.logo-container h1 {
  color: white;
  font-size: 40px;
}
</style>