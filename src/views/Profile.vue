<template>
  <div>
    <form class="profile-form" @submit.prevent="updateProfile">
      <div class="profile-picture">
        <img :src="userData.picture" alt="Profile Picture">
      </div>
      <div class="profile-info">
        <label>Name</label>
        <input type="text" v-model="userData.name">
        <label>Surname</label>
        <input type="text" v-model="userData.surname">
        <label>Email</label>
        <input type="text" v-model="userData.email">
        <input type="submit" value="Save" />
      </div>
    </form>
    <div>
      <button>Delete account</button>
      <button @click="redirectToPasswordChange">Change password</button>
    </div>
    <h1 v-if="showSuccessMessage">Profile updated successfully!</h1>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import useUserData from '../composables/useUserData';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Profile',
  setup() {
    const { userData, fetchUserData } = useUserData();
    const store = useStore();
    const showSuccessMessage = ref(false); // Reactive variable for showing the success message

    const updateProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Alternatively, you can use `store.state.token`
        const response = await fetch("http://localhost:3000/updateProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(userData.value)
        });

        if (!response.ok) {
          throw new Error("Profile update failed!");
        }

        // Handle success
        showSuccessMessage.value = true; // Show success message

        // Optionally, hide the message after a few seconds
        setTimeout(() => {
          showSuccessMessage.value = false;
        }, 3000);

      } catch (error) {
        console.error("Profile update error:", error);
      }
    };

    const router = useRouter();

    const redirectToPasswordChange = () => {
      router.push('/password-change');
    };

    onMounted(fetchUserData);

    return {
      userData,
      updateProfile,
      showSuccessMessage,
      redirectToPasswordChange
    };
  }
}
</script>


<style>
.profile-form {
  display: flex;
  align-items: center;
  gap: 20px; /* Adjust the space between picture and info */
}

.profile-picture {
  /* You can set a specific width and height for the image container */
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-picture img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%; /* Optional: makes the image round */
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info label {
  margin-top: 10px; /* Adjust spacing between labels and inputs */
}
</style>