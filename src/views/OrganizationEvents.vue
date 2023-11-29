<template>
  <h1 class="white-title">My Organization Events</h1>
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
            <button class="event-delete" @click="toggleModal(event.id, event.title)">Remove</button>
            <router-link class="event-details-link" :to="{ name: 'EventDetails', params: { id: event.id } }">Details</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-events-message" v-else>
      No events created
    </div>
    <EventDeleteModal 
    v-if="showModal" 
    :eventName="selectedEventName" 
    @close="toggleModal" 
    @confirm="confirmDeletion" 
    />
  </div>
  <router-link class="event-details-link" :to="{ name: 'Create Event' }">Create Event+</router-link>
</template>

<script>
import { ref, onMounted } from 'vue';
import useDateFormat from '@/composables/useDateFormat';
import { useStore } from 'vuex';
import EventDeleteModal from '../components/EventDeleteModal.vue'
import { useRouter } from 'vue-router';


export default {
name: 'OrganizationEvents',
components: {
    EventDeleteModal
},
setup() {
  const store = useStore();
  const createdEvents = ref([]);
  const showModal = ref(false);
  const selectedEventId = ref(null);
  const selectedEventName = ref('');
  const { formatDate } = useDateFormat();
  const router = useRouter(); // Added router instance

  const toggleModal = (eventId, eventName) => {
    showModal.value = !showModal.value;
    selectedEventId.value = eventId;
    selectedEventName.value = eventName;
  };

  const confirmDeletion = async () => {
  await deleteEvent(selectedEventId.value); // Implement this function
  showModal.value = false;
  };

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

  const fetchCreatedEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/organization-events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${store.state.token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch created events.");
      }

      const data = await response.json();
      createdEvents.value = data;
      console.log(createdEvents)

    } catch (error) {
      console.error("Error fetching created events:", error);
    }
  };

  const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`http://localhost:3000/organization-events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${store.state.token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete event.");
    }

    // Update the local state to reflect the deletion
    createdEvents.value = createdEvents.value.filter(event => event.id !== eventId);

  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

onMounted(async () => {
    await checkOrganizationExists();
    await fetchCreatedEvents(); // Updated function name
});

  return {
    createdEvents,
    formatDate,
    showModal,
    selectedEventName,
    toggleModal,
    confirmDeletion
  };
}
};

</script>

<style>

.event-item{
  margin-bottom: 40px;
}

</style>