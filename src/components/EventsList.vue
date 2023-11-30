<template>
    <div class="events-container">
        <table class="events-table">
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
                <tr class="event-item" v-for="event in eventData" :key="event.title">
                    <td class="event-title">{{ event.title }}</td>
                    <td class="event-date">{{ formatDate(event.date_start, event.date_end) }}</td>
                    <td class="event-location">{{ event.location }}</td>
                    <td class="event-type">{{ event.activitytype }}</td>
                    <td class="buttons-container">
                        <button class="event-save" 
                                :class="{ 'saved-event': savedEvents[event.id] }" 
                                @click="toggleSave(event.id)">
                            {{ savedEvents[event.id] ? 'Saved ✓' : 'Save' }}
                        </button>
                        <router-link class="event-details-link" :to="{ name: 'EventDetails', params: { id: event.id } }">Details</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
import { ref, toRefs } from 'vue';
import useDateFormat from '@/composables/useDateFormat';
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import useSavedEvents from '@/composables/useSavedEvents';
import useSaveUnsaveEvents from '@/composables/useSaveUnsaveEvents';

export default {
    props: ['eventData', 'toggleDeleteModal'],
    setup(props, { emit }) {
        const { eventData } = toRefs(props);
        const store = useStore();
        const localSavedEvents = ref({});

        const { saveEvent, unsaveEvent } = useSaveUnsaveEvents();

        const toggleSave = async (eventId) => {
            if (savedEvents.value[eventId]) {
                const unsaved = await unsaveEvent(eventId);
                if (unsaved) {
                    delete savedEvents.value[eventId];
                }
            } else {
                const saved = await saveEvent(eventId);
                if (saved) {
                    savedEvents.value[eventId] = true;
                }
            }
        }


        const { formatDate } = useDateFormat();

        const { savedEvents, fetchSavedEvents } = useSavedEvents();

        onMounted(fetchSavedEvents);

        return {
            eventData,
            saveEvent,
            formatDate,
            savedEvents,
            toggleSave,
            unsaveEvent
        }
    }
    
}
</script>



<style>
.events-container {
    width: 90%;
    margin: 20px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 8px;
    background-color: #ecf0f1;
    overflow-x: auto;
}

.events-table {
    width: 100%;
    border-collapse: collapse;
}

.events-table th, .events-table td {
    text-align: left;
    padding: 8px;
    border-bottom: 1px solid #bdc3c7;
    flex: 1; 
}

.events-table thead th {
    background-color: #34495e;
    color: #ffffff;
}

.event-item {
    transition: background-color 0.3s ease;
}

.event-item:hover {
    background-color: #f8f9f9;
}

.event-title, .event-date, .event-location, .event-type {
    font-size: 16px;
}

.event-save {
    background-color: #e74c3c;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
}

.event-save:hover {
    background-color: #c0392b;
}

.saved-event {
    background-color: #34495e;
}

.saved-event:hover {
    background-color: #2c3e50;
}

.event-details-link {
    background-color: #e74c3c;
    color: #ffffff;
    padding: 6px 10px;
    text-decoration: none;
    border-radius: 4px;
    margin-left: 8px;
    font-size: 14px;
}

.event-details-link:hover {
    background-color: #c0392b;
}

.buttons-container {
    display: flex;
    align-items: center;
}


</style>