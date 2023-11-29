<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="!isLoading && !error">
      <h1 class="white-title">Homepage</h1>
      <SearchForm :eventData="eventData" @form-data="handleFormData"></SearchForm>
      <EventsList :eventData="displayedEvents" @deleteEvent="setTitleForModal"/>
      <teleport to="#modals" v-if="showDeleteModal">
        <DeleteModal @close="toggleDeleteModal">
          <template v-slot:eventTitle>
            <h1>{{ selectedEventTitle }}</h1>
          </template>
        </DeleteModal>
      </teleport>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import EventsList from '@/components/EventsList.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import SearchForm from '@/components/SearchForm.vue';
import useEventData from '@/composables/useEventData';

export default {
  name: "Home",
  components: {
    EventsList,
    DeleteModal,
    SearchForm
  },
  setup() {
    // console.log("Initial eventData in Home:", eventData.value);
    // console.log("Initial displayedEvents in Home:", displayedEvents.value);
    const { eventData, isLoading, error } = useEventData();

    const showDeleteModal = ref(false);
    const selectedEventTitle = ref('');
    const displayedEvents = ref([]);

    watch(eventData, (newEventData) => {
        displayedEvents.value = [...newEventData];
    });

    const toggleDeleteModal = () => {
      showDeleteModal.value = !showDeleteModal.value;
    };

    const setTitleForModal = (title) => {
      selectedEventTitle.value = title;
      toggleDeleteModal();
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        const distance = R * c; 

        return distance;
    };

    const geocodeEventLocation = async (location) => {
        const apiKey = process.env.VUE_APP_GOOGLE_API_KEY;
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`);
        const data = await response.json();
        console.log("Geocode API response for location", location, ":", data);
        if (data.results[0]) {
            return {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng
            };
        } else {
            console.error("Geocode failed for location:", location);
            return {}; // Return an empty object to avoid undefined
        }
    };

    const handleFormData = async (data) => {
    console.log("Data received from form:", data);
    const filteredEvents = [];

    for (let event of eventData.value) {
        console.log("Current event being processed:", event);
        let matchesCriteria = true;

        if (data.userCoordinates) {
            console.log("Geocoding event location:", event.location);
            const eventCoordinates = await geocodeEventLocation(event.location);
            console.log("Event coordinates:", eventCoordinates);

            // Check if eventCoordinates are valid
            if (!eventCoordinates || !eventCoordinates.lat || !eventCoordinates.lng) {
                console.log("Invalid or missing eventCoordinates for event:", event.name);
                matchesCriteria = false; // Skip this event
            } else {
                const distance = calculateDistance(
                    data.userCoordinates.lat, data.userCoordinates.lng,
                    eventCoordinates.lat, eventCoordinates.lng
                );
                console.log("Calculated distance for event:", event.name, "is", distance, "km");

                if (distance > data.radius) {
                    matchesCriteria = false;
                }
            }
        }

            if (data.activityType && event.activitytype !== data.activityType) {
                matchesCriteria = false;
            }
  
            if (data.organizer && event.organizer_id !== data.organizer) {
                matchesCriteria = false;
            }

            if (data.date) {
                const eventStart = event.date_start;
                const eventEnd = event.date_end;
                const searchStartDate = data.date[0];
                const searchEndDate = data.date[1] + 86399;
  
                if (eventStart > searchEndDate || eventEnd < searchStartDate) {
                    matchesCriteria = false;
                }
            }

            if (matchesCriteria) {
                filteredEvents.push(event);
            }
        }
        console.log("Filtered events:", filteredEvents);
        displayedEvents.value = [...filteredEvents]; // Use .value with refs in Composition API
    };

    return {
      eventData,
      isLoading,
      error,
      showDeleteModal,
      selectedEventTitle,
      displayedEvents,
      toggleDeleteModal,
      setTitleForModal,
      handleFormData
      // ... other returned values
    };
  },
};
</script>

<style>
#app, #modals {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>