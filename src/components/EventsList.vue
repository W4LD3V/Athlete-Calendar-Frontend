<template>
    <div class="events-container">
        <ul class="events-list">
            <li class="event-item" v-for="event in eventData" :key="event.title">
                <div class="event-content">
                    <h1 class="event-title">{{ event.title }}</h1>
                    <p class="event-date">{{ formatDate(event.date_start, event.date_end) }}</p>
                    <p class="event-location">{{ event.location }}</p>
                    <p class="event-type">{{ event.activitytype }}</p>
                    <p class="event-organizer">{{ event.organizer }}</p>
                    <div class="button-container">
                        <button class="event-delete" @click="emitDeleteEvent(event.title)">Save</button>
                        <router-link :to="{ name: 'EventDetails', params: { id: event.id } }">Details</router-link>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { ref, toRefs } from 'vue';

export default {
    props: ['eventData', 'toggleDeleteModal'],
    setup(props, { emit }) {
        const { eventData } = toRefs(props); // Convert props to reactive refs

        const emitDeleteEvent = (title) => {
            emit('deleteEvent', title);
        }

        const formatDate = (timestampStart, timestampEnd) => {
            const startObj = new Date(timestampStart * 1000);
            const endObj = new Date(timestampEnd * 1000);
            
            const formatDate = (dateObj) => {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            const formatTime = (dateObj) => {
                const hours = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                return `${hours}:${minutes}`;
            }

            const getWeekday = (dateObj) => {
                const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return weekdays[dateObj.getDay()];
            }
            
            // console.log("Events received in EventsList:", eventData.value);
            return `${formatDate(startObj)} (${getWeekday(startObj)}) | ${formatTime(startObj)} - ${formatTime(endObj)}`;
        }

        return {
            eventData,
            emitDeleteEvent,
            formatDate,
        }
    }
}
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
}

/* Events List */
.events-list {
    list-style-type: none; /* Removes bullets from the list */
    padding: 0;
}

/* Individual Event styling */
.event-item {
    margin: 15px 0;
    border-bottom: 1px solid #bdc3c7;
    padding-bottom: 10px;
}

.event-content {
    display: flex;
    flex-direction: column;
}

.event-title {
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 8px;
}

.event-date, .event-location, .event-type, .event-organizer {
    font-size: 16px;
    color: #34495e;
    margin: 4px 0;
}

.event-delete {
    background-color: #e74c3c;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.event-delete:hover {
    background-color: #c0392b; /* Slightly darker shade for hover */
}

.button-container button:not(:last-child) {
    margin-right: 5px;
}

</style>