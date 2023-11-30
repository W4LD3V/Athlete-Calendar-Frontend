<template>
  <div class="right-side">
    <div class="form">
      <h1>Signup</h1>
      <div class="input-container">
        <label for="name">Name</label>
        <input id="name" v-model="name" @keyup="handleKeyup"/>
        <label for="surname">Surname</label>
        <input id="surname" v-model="surname" @keyup="handleKeyup"/>
        <label for="email">E-mail</label>
        <input id="email" v-model="email" type="email" @keyup="handleKeyup"/>
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" @keyup="handleKeyup"/>
        <label for="repeat_password">Repeat password</label>
        <input id="repeat_password" type="password" v-model="repeat_password" @keyup="handleKeyup"/>
        <label for="type">Account type:</label>
        <select v-model="type" name="type" id="type">
          <option value="athlete">Athlete</option>
          <option value="organizer">Organizer</option>
        </select> 
        <p v-if="signupError" class="error-text">{{ signupErrorMessage }}</p>
      </div>
      <div class="button-container">
        <button class="login-button" :disabled="isSubmitting" @click="signup">
          <span v-if="!isSubmitting">Sign-up</span>
          <span v-else>Submitting...</span>
        </button>
        <p>Already have an account? <router-link to="/login">Login here.</router-link></p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const password = ref('');
    const repeat_password = ref('');
    const type = ref('');
    const isSubmitting = ref(false);
    const signupError = ref(false);
    const signupErrorMessage = ref('');
    const router = useRouter();
    const attemptedSubmit = ref(false);

    const passwordsMatch = computed(() => {
      return password.value === repeat_password.value;
    });

    const isValidEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    const signup = async () => {
      attemptedSubmit.value = true;
      signupError.value = false;
      signupErrorMessage.value = '';

      if (!name.value.trim()) {
        signupErrorMessage.value = 'Name is required.';
      } else if (!surname.value.trim()) {
        signupErrorMessage.value = 'Surname is required.';
      } else if (!email.value.trim() || !isValidEmail(email.value)) {
        signupErrorMessage.value = 'Please enter a valid email address.';
      } else if (!passwordsMatch.value) {
        signupErrorMessage.value = 'Passwords do not match.';
      } else if (!password.value.trim()) {
        signupErrorMessage.value = 'Password is required.';
      } else if (!type.value.trim()) {
        signupErrorMessage.value = 'Type is required.';
      } else {
        isSubmitting.value = true;
        try {
          const response = await fetch(process.env.VUE_APP_API_URL + "/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              surname: surname.value,
              email: email.value,
              password: password.value,
              type: type.value
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            signupError.value = true;
            signupErrorMessage.value = data.message || "Signup failed!";
          } else {
            router.push("/login");
          }
        } catch (error) {
          signupError.value = true;
          signupErrorMessage.value = "There was an error connecting to the server.";
          console.error("Signup error:", error);
        } finally {
          isSubmitting.value = false;
        }
        return;
      }

      signupError.value = true;
    };

    const handleKeyup = (event) => {
      if (event.key === 'Enter') {
        signup();
      }
    };

    return {
      name,
      surname,
      email,
      password,
      repeat_password,
      type,
      passwordsMatch,
      signup,
      isSubmitting,
      signupError,
      signupErrorMessage,
      attemptedSubmit,
      isValidEmail,
      handleKeyup
    };
  },
};
</script>



<style scoped>
.error-text {
  color: red;
}

select {
  font-family: 'Montserrat', sans-serif;
}
</style>
