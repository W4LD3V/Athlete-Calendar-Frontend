<template>
    <h1>Create Organization</h1>
    <p>To continue, please fill in the <br>
    necessary information for your organization.</p>
    <form>
        <label>Organization name</label>
        <input type="text" v-model="name">
        <label>Description</label>
        <input type="text" v-model="description">
        <label>Contact Information</label>
        <input type="text" v-model="contact_info">
        <label>Organization Image</label>
        <p v-if="creationError" class="error-text">{{ creationErrorMessage }}</p>
        <div class="button-container">
            <button class="login-button" @click="createOrganization($event)">Create</button>
        </div>
    </form>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const name = ref('');
    const description = ref('');
    const contact_info = ref('');
    const picture = ref('');
    const creationError = ref(false);
    const creationErrorMessage = ref('');
    const router = useRouter();

    const createOrganization = async (e) => {
      e.preventDefault();
      creationError.value = false;
      creationErrorMessage.value = '';

      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/create-organizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: name.value,
            description: description.value,
            contact_info: contact_info.value,
            picture: picture.value
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          creationError.value = true;

          if (response.status === 409) {
            creationErrorMessage.value = "Organization name already exists, please choose a different name.";
          } else {
            creationErrorMessage.value = data.message || "Creation failed!";
          }
          return; // Stop the function here
        }

        const data = await response.json();
        router.push("/organization-events");

      } catch (error) {
        creationError.value = true;
        creationErrorMessage.value = "There was an error connecting to the server.";
        console.error("Creation error:", error);
      }
    };

    const handleKeyup = (event) => {
      // Check if the key pressed is the Enter key
      if (event.key === 'Enter') {
        createOrganization();
      }
    };

    return {
      name,
      description,
      contact_info,
      picture,
      createOrganization,
      handleKeyup,
      creationError,
      creationErrorMessage
    };
  },
};
</script>


<style>

</style>