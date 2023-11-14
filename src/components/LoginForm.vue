<template>
    <div class="right-side">
      <div class="form">
        <h1>Login.</h1>
        <div class="input-container">
          <label for="email">E-mail:</label>
          <input id="email" v-model="email" @keyup="handleKeyup"/>
          <label for="password">Password:</label>
          <input id="password" type="password" v-model="password" @keyup="handleKeyup"/>
          <p v-if="loginError" class="error-text">{{ loginErrorMessage }}</p>
        </div>
        <div class="button-container">
          <button class="login-button" @click="login">Login</button>
          <p>Don't have an account? <router-link to="/auth/signup">Sign up here.</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();
      const store = useStore();
      const loginError = ref(false);
      const loginErrorMessage = ref('');
  
      const login = async () => {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          loginError.value = true;
          loginErrorMessage.value = data.message || "Login failed!";
          return; // Stop the function here
        }

        const data = await response.json();
        store.commit("setToken", data.token);

        if (data.is_organizer !== true){
          router.push("/");
        }
        else if (data.is_organizer == true && data.hasOrganization == false){
          router.push("/create-organization");
        }
        else if (data.is_organizer == true && data.hasOrganization == true){
          router.push("/organization-events");
        }

      } catch (error) {
        loginError.value = true;
        loginErrorMessage.value = "There was an error connecting to the server.";
        console.error("Login error:", error);
      }
    };

    const handleKeyup = (event) => {
      // Check if the key pressed is the Enter key
      if (event.key === 'Enter') {
        login();
      }
    };
  
      return {
        email,
        password,
        login,
        loginError,
        loginErrorMessage,
        handleKeyup
      };
    },
  };
  </script>
  
  <style scoped>
  .error-text {
    color: red;
  }
  </style>
  
  