<template>
    <div>
      <h2 class="white-title">Change Password</h2>
      <form @submit.prevent="handleChangePassword">
        <div>
          <label for="oldPassword">Old Password:</label>
          <input id="oldPassword" type="password" v-model="oldPassword" required>
        </div>
        <div>
          <label for="newPassword">New Password:</label>
          <input id="newPassword" type="password" v-model="newPassword" required>
        </div>
        <div>
          <label for="confirmPassword">Confirm New Password:</label>
          <input id="confirmPassword" type="password" v-model="confirmPassword" required>
        </div>
        <button class="submit" type="submit">Change Password</button>
        <h3 v-if="successMessage">{{ successMessage }}</h3>
        <h3 v-if="errorMessage" class="error">{{ errorMessage }}</h3>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'ChangePassword',
    setup() {
      const oldPassword = ref('');
      const newPassword = ref('');
      const confirmPassword = ref('');
      const successMessage = ref('');
      const errorMessage = ref('');
      const store = useStore();
      const router = useRouter();
  
      const handleChangePassword = async () => {
        if (newPassword.value !== confirmPassword.value) {
          errorMessage.value = "New passwords do not match.";
          return;
        }
  
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(process.env.VUE_APP_API_URL + "/changePassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              oldPassword: oldPassword.value,
              newPassword: newPassword.value
            })
          });
  
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Password change failed!");
          }
  
          successMessage.value = "Password changed successfully! Redirecting to profile...";
          setTimeout(() => {
            router.push('/profile');
          }, 3000);
  
        } catch (error) {
          errorMessage.value = error.message;
        }
      };
  
      return {
        oldPassword,
        newPassword,
        confirmPassword,
        successMessage,
        errorMessage,
        handleChangePassword
      };
    }
  }
  </script>
  
  <style scoped>
  .error {
    color: red;
  }

  .submit {
    background-color: #2c3e50;
    color: #ecf0f1;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    margin-top: 20px;
    font-weight: bold;
  }
  </style>
  