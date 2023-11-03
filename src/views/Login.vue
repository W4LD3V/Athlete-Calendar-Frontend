<template>
  <div>
    <input v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const store = useStore();

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
          throw new Error("Login failed!");
        }

        const data = await response.json();
        store.commit("setToken", data.token);
        // Save token to localStorage
        localStorage.setItem('token', data.token);


        // Redirect to home page
        router.push("/");
      } catch (error) {
        console.error("Login error:", error);
      }
    };

    return {
      email,
      password,
      login,
    };
  },
};
</script>
