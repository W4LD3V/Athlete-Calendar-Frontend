<template>
  <div class="events-container">
    <table class="events-table" v-if="savedEvents && savedEvents.length">
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
        <tr class="event-item" v-for="event in savedEvents" :key="event.title">
          <td class="event-title">{{ event.title }}</td>
          <td class="event-date">{{ formatDate(event.date_start, event.date_end) }}</td>
          <td class="event-location">{{ event.location }}</td>
          <td class="event-type">{{ event.activitytype }}</td>
          <td class="buttons-container">
            <button class="event-delete" @click="emitDeleteEvent(event.id)">Remove</button>
            <router-link class="event-details-link" :to="{ name: 'EventDetails', params: { id: event.id } }">Details</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-events-message" v-else>
      No events saved
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import useDateFormat from '@/composables/useDateFormat';
import { useStore } from 'vuex';
import useSaveUnsaveEvents from '@/composables/useSaveUnsaveEvents';

export default {
  name: 'SavedEvents',
  setup() {
    const store = useStore();
    const savedEvents = ref([]);
    const { unsaveEvent } = useSaveUnsaveEvents();

    const { formatDate } = useDateFormat();

    const fetchSavedEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/saved-events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Assuming you have a way to access the store state in setup (e.g., useStore from Vuex 4)
            "Authorization": `Bearer ${store.state.token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch saved events.");
        }

        const data = await response.json();
        savedEvents.value = data;

      } catch (error) {
        console.error("Error fetching saved events:", error);
      }
    };

    const emitDeleteEvent = async (eventId) => {
      const unsaved = await unsaveEvent(eventId);
      if (unsaved) {
        // Update the local state to remove the unsaved event
        savedEvents.value = savedEvents.value.filter(event => event.id !== eventId);
      }
    }

    onMounted(fetchSavedEvents);

    return {
      savedEvents,
      formatDate,
      emitDeleteEvent
    };
  }
};
</script>

<style>
/* Events Container */
.events-container {
    width: 90%;
    margin: 20px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 8px;
    background-color: #ecf0f1;
    overflow-x: auto; /* Ensures table is responsive */
}

/* Events Table */
.events-table {
    width: 100%;
    border-collapse: collapse; /* Collapses the border */
}

.events-table th, .events-table td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #bdc3c7;
}

/* Header */
.events-table thead th {
    background-color: #34495e;
    color: #ffffff;
}

/* Individual Event styling */
.event-item {
    transition: background-color 0.3s ease;
}

.event-item:hover {
    background-color: #f8f9f9;
}

.event-title, .event-date, .event-location, .event-type {
    font-size: 16px;
}

/* Remove Button */
.event-delete {
    background-color: #e74c3c;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
}

.event-delete:hover {
    background-color: #c0392b;
}


.no-events-message {
    text-align: center;
    padding: 20px;
    font-size: 20px;
    color: #7f8c8d;
}
</style>
