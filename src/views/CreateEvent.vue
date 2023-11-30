<template>
    <h1 class="white-title">Create Event</h1>
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
        <Datepicker v-model="start_date" :format="'YYYY-MM-DD HH:mm'" :time-picker="true" />
        <label>Start Time:</label>
        <input type="time" v-model="start_time">
        <label>End date:</label>
        <Datepicker v-model="end_date" :format="'YYYY-MM-DD HH:mm'" :time-picker="true" />
        <label>End Time:</label>
        <input type="time" v-model="end_time">
        <label>Visibility date:</label>
        <Datepicker v-model="visibility_date" :format="'YYYY-MM-DD HH:mm'" :time-picker="true" />
        <label>Visibility Time:</label>
        <input type="time" v-model="visibility_time">
        <label>Description:</label>
        <input type="text" v-model="description">
        <label>GPX file:</label>
        <input type="text" v-model="gpx">
        <label>Organization image:</label>
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
import Datepicker from 'vue3-datepicker';

export default {
  components: {
    Datepicker
  },
  setup() {
    const router = useRouter();
    const title = ref('');
    const location = ref('');
    const type = ref('');
    const start_date = ref(null);
    const end_date = ref(null);
    const visibility_date = ref(null);
    const description = ref('');
    const gpx = ref('');
    const picture = ref('');
    const creationError = ref(false);
    const creationErrorMessage = ref('');
    const start_time = ref('');
    const end_time = ref(''); 
    const visibility_time = ref('');

    function convertTo24Hour(time) {
      let [hours, minutesPart] = time.split(':');
      const minutes = minutesPart.substring(0, 2);
      const meridian = minutesPart.substring(2).toUpperCase();

      if (meridian === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
      } else if (meridian === 'AM' && hours === '12') {
        hours = '00';
      }
      return `${hours}:${minutes}`;
    }

    const createEvent = async (e) => {
      e.preventDefault();
      creationError.value = false;
      creationErrorMessage.value = '';

      const formattedDate = start_date.value.toISOString().split('T')[0];
      console.log("Formatted Start Date:", formattedDate);

      const combinedStartDateTime = formattedDate && start_time.value 
        ? `${formattedDate}T${start_time.value}:00` 
        : null;

      console.log("Combined Start DateTime:", combinedStartDateTime);

      const unixStartDate = combinedStartDateTime 
        ? Math.floor(new Date(combinedStartDateTime).getTime() / 1000) 
        : null;


        const formattedEndDate = end_date.value.toISOString().split('T')[0];
      const combinedEndDateTime = formattedEndDate && end_time.value 
        ? `${formattedEndDate}T${end_time.value}:00` 
        : null;
      const unixEndDate = combinedEndDateTime 
        ? Math.floor(new Date(combinedEndDateTime).getTime() / 1000) 
        : null;

      const formattedVisibilityDate = visibility_date.value.toISOString().split('T')[0];
      const combinedVisibilityDateTime = formattedVisibilityDate && visibility_time.value 
        ? `${formattedVisibilityDate}T${visibility_time.value}:00` 
        : null;
      const unixVisibilityDate = combinedVisibilityDateTime 
        ? Math.floor(new Date(combinedVisibilityDateTime).getTime() / 1000) 
        : null;


      console.log("Start Date:", unixStartDate);
      console.log("End Date:", unixEndDate);
      console.log("Visibility Date:", unixVisibilityDate);
      console.log("Form Data:", {
        title: title.value,
        date_start: unixStartDate,
      });

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.VUE_APP_API_URL + "/organization-events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
            body: JSON.stringify({
                title: title.value,
                date_start: unixStartDate,
                date_end: unixEndDate,
                location: location.value,
                activityType: type.value,
                description: description.value,
                gpx: gpx.value || null, 
                visibility_date: unixVisibilityDate.value || null,
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
          return;
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
      createEvent,
      start_time,
      end_time,
      visibility_time,
    }
  }
}

</script>
