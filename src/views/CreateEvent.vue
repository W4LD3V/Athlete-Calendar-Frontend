<template>
    <h1>Create Event</h1>
    <p>To continue, please fill in the <br>
    necessary information for the event.</p>
    <form>
        <label>Title:</label>
        <input type="text" v-model="title">
        <label>Location:</label>
        <input type="text" v-model="location">
        <label>Type:</label>
        <input type="text" v-model="type">
        <label>Start date:</label>
        <input type="text" v-model="start_date">
        <label>End date:</label>
        <input type="text" v-model="end_date">
        <label>Visibility date:</label>
        <input type="text" v-model="visibility_date">
        <label>Description:</label>
        <input type="text" v-model="description">
        <label>GPX file:</label>
        <input type="text" v-model="gpx">
        <label>Organization image:</label>
        <input type="text" v-model="picture">
        <p v-if="creationError" class="error-text">{{ creationErrorMessage }}</p>
        <div class="button-container">
            <button class="create-button" @click="createEvent($event)">Create Event</button>
        </div>
    </form>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const router = useRouter();
    const title = ref('');
    const location = ref('');
    const type = ref('');
    const start_date = ref('');
    const end_date = ref('');
    const visibility_date = ref('');
    const description = ref('');
    const gpx = ref('');
    const picture = ref('');
    const creationError = ref(false);
    const creationErrorMessage = ref('');

    const createEvent = async (e) => {
      e.preventDefault();
      creationError.value = false;
      creationErrorMessage.value = '';

      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/organization-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
            body: JSON.stringify({
                title: title.value,
                date_start: start_date.value,
                date_end: end_date.value,
                location: location.value,
                activityType: type.value,
                description: description.value,
                gpx: gpx.value || null, 
                visibility_date: visibility_date.value || null,
                picture: picture.value || null,
                }),
            });

        if (!response.ok) {
          const data = await response.json();
          creationError.value = true;

          if (response.status === 409) {
            creationErrorMessage.value = "Event title already exists, please choose a different title.";
          } else {
            creationErrorMessage.value = data.message || "Event creation failed!";
          }
          return; // Stop the function here
        }

        await response.json();
        router.push("/organization-events");

      } catch (error) {
        creationError.value = true;
        creationErrorMessage.value = "There was an error connecting to the server.";
        console.error("Creation error:", error);
      }
    };

    return {
      title,
      location,
      type,
      start_date,
      end_date,
      visibility_date,
      description,
      gpx,
      picture,
      creationError,
      creationErrorMessage,
      createEvent
    }
  }
}

</script>