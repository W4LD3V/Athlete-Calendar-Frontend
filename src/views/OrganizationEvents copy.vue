<template>
    <h1>My Organization Events</h1>
    <div class="events-container">
      <table class="events-table" v-if="createdEvents && createdEvents.length">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="event-item" v-for="event in createdEvents" :key="event.title">
            <td class="event-title">{{ event.title }}</td>
            <td class="event-date">{{ formatDate(event.date_start, event.date_end) }}</td>
            <td class="event-location">{{ event.location }}</td>
            <td class="event-type">{{ event.activitytype }}</td>
            <td class="buttons-container">
              <button class="event-delete" @click="toggleModal(event.id)">Remove</button>
              <DeleteEventModal
              v-if="showModal"
              @close="toggleModal"
              :eventId="event.id"
              @event-deleted="refreshEventList"
              >
              </DeleteEventModal>
              <router-link class="event-details-link" :to="{ name: 'EventDetails', params: { id: event.id } }">Details</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="no-events-message" v-else>
        <h2>No events created</h2>
      </div>
      <p>Press this <router-link to="/create-event">button</router-link> to create an event.</p>
    </div>
  </template>

<script>
import { ref, onMounted, routerLink, useRouter } from 'vue';
import useDateFormat from '@/composables/useDateFormat';
import { useStore } from 'vuex';
import DeleteEventModal from '../components/DeleteEventModal.vue';


export default {
  name: 'OrganizationEvents',
  components: {
    DeleteEventModal,
  },
  setup() {
    const store = useStore();
    const createdEvents = ref([]);
    const showModal = ref(false);
    const eventData = ref({ id: null });
    const router = useRouter(); // Added router instance

    const { formatDate } = useDateFormat();

    const checkOrganizationExists = async () => {
      try {
        const response = await fetch("http://localhost:3000/organizer", {
          headers: {
            "Authorization": `Bearer ${store.state.token}`
          }
        });

        if (!response.ok) {
          // Redirect if organization does not exist
          router.push('/create-organization');
        }
      } catch (error) {
        console.error("Error checking organization existence:", error);
        router.push('/organization-events');
      }
    };

    const refreshEventList = async () => {
      await fetchOrganizationEventData();
      showModal.value = false; // Close the modal after event deletion
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
        createdEvents.value = data;

        if (data && data.length > 0) {
          eventData.value = data[0]; // Assign the first item of the array to eventData
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };


    const deleteEvent = async (eventId) => {
    console.log("Event ID in deleteEvent:", eventId); // Add this line
    const userId = store.state.userId;

    try {
      const response = await fetch(`http://localhost:3000/organization-events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${store.state.token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event.");
      }

      // Call fetchOrganizationEventData to refresh the events
      await fetchOrganizationEventData();

      return true;
    } catch (error) {
      console.error("Error deleting the event:", error);
      return false;
    }
  };

    const toggleModal = (eventId) => {
    console.log("Clicked Remove button with eventId:", eventId);
    showModal.value = !showModal.value;
    if (showModal.value) {
      // Pass the eventId to the modal if it's being shown
    }
  };



  onMounted(async () => {
      await checkOrganizationExists();
      await fetchOrganizationEventData();
    });

    return {
      createdEvents,
      formatDate,
      deleteEvent,
      showModal,
      eventData,
      toggleModal,
      refreshEventList, // Expose the function here
    };
  }
};

</script>

<style>
</style>