<template>
    <div>
      <h1 class="white-title">Organization</h1>
      <form class="profile-form" @submit.prevent="updateProfile">
        <div class="profile-picture">
          <img :src="previewUrl || eventData.picture" alt="Organization Picture">
          <input type="file" @change="handleFileUpload" accept="image/*">
          <button type="button" @click="confirmPictureUpload" v-if="newPicture">Confirm</button>
          <button type="button" @click="cancelPictureUpload" v-if="newPicture">Cancel</button>
          <div class="profile-buttons">
            <button @click="toggleModal">Delete organization</button>
            <DeleteModal v-if="showModal" @close="toggleModal" />
          </div>
        </div>
        <div class="profile-info">
            <label>Organization Name</label>
            <input type="text" v-model="organizationData.name">
            <label>Description</label>
            <input type="text" v-model="organizationData.description">
            <label>Contact Information</label>
            <input type="text" v-model="organizationData.contact_info">
            <button @click="redirectToPasswordChange">Change credentials</button>
        </div>
    </form>
    </div>
  </template>
  
  <script>
    import { onMounted, ref } from 'vue';
    import useUserData from '../composables/useUserData';
    import { useStore } from 'vuex';
    import { useRouter } from 'vue-router';
    import DeleteModal from '../components/DeleteModal.vue';
  
  export default {
    name: 'Profile',
    components: {
      DeleteModal, // Register the DeleteModal component
    },
    setup() {
        const organizationData = ref({});
        const eventData = ref({}); // Object to store event data
        const name = ref(''); // Define name as a reactive property
        const description = ref(''); // Define description as a reactive property
        const contact_info = ref(''); // Define contact_info as a reactive property
        const store = useStore();
        const newPicture = ref(null);
        const previewUrl = ref('');
  
        console.log("Initial organization data:", organizationData.value);

      const handleFileUpload = event => {
        const file = event.target.files[0];
        newPicture.value = file;
        previewUrl.value = URL.createObjectURL(file);
      };

    
            
    const fetchOrganizationEventData = async () => {
        try {
            const response = await fetch("http://localhost:3000/organization-events", {
                headers: {
                    "Authorization": `Bearer ${store.state.token}`
                }
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }
    
            const data = await response.json();
                if (data && data.length > 0) {
                eventData.value = data[0]; // Assign the first item of the array to eventData
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            };

    const fetchOrganizationData = async () => {
        try {
          const response = await fetch("http://localhost:3000/organizer", {
            headers: {
              "Authorization": `Bearer ${store.state.token}`
            }
          });

          if (!response.ok) {
            // If the server returns a 500 error, redirect to the create-organization page
            if (response.status === 500) {
              router.push('/create-organization');
            } else {
              throw new Error("Failed to fetch organization data.");
            }
          }

          const data = await response.json();

          if (!data || Object.keys(data).length === 0) {
            router.push('/create-organization');
          } else {
            organizationData.value = data;
          }

        } catch (error) {
          console.error("Error fetching organization data:", error);
        }
      };
  
      const confirmPictureUpload = async () => {
        console.log('confirmPictureUpload triggered');
        const formData = new FormData();
        formData.append('picture', newPicture.value);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch("http://localhost:3000/uploadProfilePicture", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            },
            body: formData
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Profile picture upload failed!");
          }
          // Update picture URL and reset the newPicture and previewUrl
          userData.picture = data.path;
          newPicture.value = null;
          previewUrl.value = '';
          // Now fetch the latest user data
          await fetchOrganizationEventData(); // This function should re-fetch the user data, including the new profile picture
        } catch (error) {
          console.error("Profile picture upload error:", error);
        }
      };
  
  
      const cancelPictureUpload = () => {
        newPicture.value = null;
        previewUrl.value = '';
      };
  
      const updateProfile = async () => {
          try {
              console.log("Updating profile with data:", organizationData.value); // Log the data being used for update
              const token = localStorage.getItem('token');
              const response = await fetch("http://localhost:3000/updateProfile", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(organizationData.value) // Make sure this is organizationData instead of userData
              });
              if (!response.ok) {
                  throw new Error("Profile update failed!");
              }
          } catch (error) {
              console.error("Profile update error:", error);
          }
      };

      const router = useRouter();
      const redirectToPasswordChange = () => {
        router.push('/change-organization-credentials');
      };
  
      const showModal = ref(false); // Add this line to manage DeleteModal visibility
  
      const toggleModal = () => {
        showModal.value = !showModal.value;
      };
  
      onMounted(() => {
          console.log("Component mounted, fetching organization data");
          fetchOrganizationData();
      });

      return {
        organizationData,
        eventData,
        name,
        description,
        contact_info,
        updateProfile,
        redirectToPasswordChange,
        newPicture,
        previewUrl,
        handleFileUpload,
        confirmPictureUpload,
        cancelPictureUpload,
        showModal,
        toggleModal
      };
    }
  }
  </script>
  
  
  <style scoped>
  form {
  max-width: 720px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
  }
  label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  }
  input, select {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
  }
  
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
    flex-direction: column;
  }
  
  .profile-picture input {
    padding: 50px;
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
  
  .submit {
    margin-top: 20px;
    border-radius: 10px;
    color: #ecf0f1;
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
  
  .profile-buttons button:nth-child(1) {
    margin-right: 15px;
  }
  
  .profile-buttons button {
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