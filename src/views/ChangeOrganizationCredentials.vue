<template>
    <div>
      <h2 class="white-title">Change Organization Credentials</h2>
      <form @submit.prevent="handleChangeOrganizationCredentials">
        <div>
          <label for="organizationName">Organization Name:</label>
          <input id="organizationName" type="text" v-model="organizationName" required>
        </div>
        <div>
          <label for="organizationDescription">Description</label>
          <input id="organizationDescription" type="text" v-model="organizationDescription" required>
        </div>
        <div>
          <label for="contactInfo">Contact Information</label>
          <input id="contactInfo" type="text" v-model="contactInfo" required>
        </div>
        <button class="submit" type="submit">Update Credentials</button>
        <h3 v-if="successMessage">{{ successMessage }}</h3>
        <h3 v-if="errorMessage" class="error">{{ errorMessage }}</h3>
      </form>
    </div>
</template>
  
  <script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'ChangeOrganizationCredentials',
  setup() {
    const organizationName = ref('');
    const contactInfo = ref('');
    const organizationDescription = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');
    const store = useStore();
    const router = useRouter();

    const fetchOrganizationData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.VUE_APP_API_URL + "/organizer", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch organization data.");
        }

        const data = await response.json();
        organizationName.value = data.name;
        contactInfo.value = data.contact_info;
        organizationDescription.value = data.description;
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    onMounted(() => {
      fetchOrganizationData();
    });
      
  
      const handleChangeOrganizationCredentials = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(process.env.VUE_APP_API_URL + "/changeOrganizationCredentials", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              organizationName: organizationName.value,
              contactInfo: contactInfo.value,
              organizationDescription: organizationDescription.value
            })
          });
  
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Credential update failed!");
          }
  
          successMessage.value = "Credentials updated successfully!";
          setTimeout(() => {
            router.push('/my-organization');
          }, 3000);
  
        } catch (error) {
          errorMessage.value = error.message;
        }
      };
      
  
      return {
        organizationName,
        contactInfo,
        successMessage,
        errorMessage,
        organizationDescription,
        handleChangeOrganizationCredentials
      };
    }
  }
  </script>
  
  <style scoped>
  </style>
  