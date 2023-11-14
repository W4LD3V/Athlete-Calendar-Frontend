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
              <button class="event-delete" @click="emitDeleteEvent(event.id)">Remove</button>
              <router-link class="event-details-link" :to="{ name: 'EventDetails', params: { id: event.id } }">Details</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="no-events-message" v-else>
        No events created
      </div>
    </div>
  </template>

<script>
import { ref, onMounted } from 'vue';
import useDateFormat from '@/composables/useDateFormat';
import { useStore } from 'vuex';

export default {
  name: 'OrganizationEvents',
  setup() {
    const store = useStore();
    const createdEvents = ref([]);

    const { formatDate } = useDateFormat();

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

    // const emitDeleteEvent = async (eventId) => {
    //   const unsaved = await unsaveEvent(eventId);
    //   if (unsaved) {
    //     savedEvents.value = savedEvents.value.filter(event => event.id !== eventId);
    //   }
    // }

    onMounted(fetchCreatedEvents);

    return {
      createdEvents,
      formatDate
    };
  }
};

</script>

<style>

</style>