<template>
  <div>
    <form class="profile-form" @submit.prevent="updateProfile">
      <div class="profile-picture">
        <img v-if="previewPicture" :src="previewPicture" alt="Profile Picture">
        <img v-else-if="userData.picture" :src="userData.picture" alt="Profile Picture">
        <div v-else class="upload-picture">
          <label for="upload-photo">Upload a profile picture</label>
          <input type="file" id="upload-photo" @change="uploadProfilePicture" :ref="fileInputRef" style="display:none;">
        </div>
        <!-- Add a button to confirm the uploaded image -->
        <button v-if="previewPicture" @click.prevent="confirmProfilePicture">Confirm Picture</button>
        <!-- Button to trigger the file input -->
        <button type="button" @click="triggerFileInput">Change Picture</button>
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
    <div class="link-container">
      <button class="link">Delete account</button>
      <button class="link" @click="redirectToPasswordChange">Change password</button>
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
    const previewPicture = ref(null); // Temporary URL for the uploaded image

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

        // Assume the server responds with the updated user data
        const updatedUserData = await response.json();

        // Update local userData with the new data from the server
        Object.assign(userData.value, updatedUserData);

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


    const uploadProfilePicture = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('picture', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/uploadProfilePicture", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Don't set 'Content-Type': 'multipart/form-data' manually.
          // When you set the headers manually, you don't include the boundary parameter that is needed for multipart/form-data.
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Profile picture upload failed!");
      }
      
      const data = await response.json();
      previewPicture.value = data.path;

      // Fetch user data again to update the profile picture
      await fetchUserData();

    } catch (error) {
      console.error("Profile picture upload error:", error);
    }
  };

    
    const confirmProfilePicture = async () => {
      // Set the previewPicture as the user's actual picture
      userData.picture = previewPicture.value;
      // Save the profile data with the new picture
      await updateProfile();
      // Clear the preview picture as it's no longer needed
      previewPicture.value = null;
    };

    const router = useRouter();

    const redirectToPasswordChange = () => {
      router.push('/password-change');
    };

    const fileInputRef = ref(null); // This ref will hold the file input element

    const triggerFileInput = () => {
      // Debug: Log to see if the function is called
      console.log('Attempting to trigger file input', fileInputRef.value);
      
      if (fileInputRef.value) {
        fileInputRef.value.click(); // Programmatically click the file input
      }
    };

    onMounted(fetchUserData);

    return {
      userData,
      updateProfile,
      showSuccessMessage,
      redirectToPasswordChange,
      uploadProfilePicture,
      previewPicture,
      confirmProfilePicture,
      triggerFileInput,
      fileInputRef
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

.link {
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.link:hover {
    background-color: #c0392b;
}

.link-container {
  display: flex;
  justify-content: center; /* Center the buttons horizontally */
  gap: 10px; /* Adds space between the buttons */
  margin-top: 20px; /* Add some space between the form and the buttons */
}

.profile-picture,
.profile-info {
  flex: 1; /* Each child will take up half of the space */
}


</style>