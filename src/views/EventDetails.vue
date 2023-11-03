<template>
<div class="event-wrapper">
    <div class="event-left">
        <div v-if="eventDetails && eventDetails.length > 0">
            <h1>{{ eventDetails[0].title }}</h1>
            <h2>{{ formatDate(eventDetails[0].date_start, eventDetails[0].date_end) }}</h2>
            <p>{{ eventDetails[0].location }}</p>
        </div>
    </div>
    
    <div class="event-right">
        <h2>Organizer</h2>
        <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].organizer_name }}</p>
        <h2>Interest</h2>
        <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].saved_count }} people saved this event</p>
        <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].friends_saved_count }} friends saved this event</p>
        <h2>Details</h2>
        <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].description }}</p>
        
        <div class="interest">
        </div>
    </div>
</div>
</template>    


<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import useDateFormat from '@/composables/useDateFormat';

export default {
    name: 'EventDetails',
    setup() {
        const route = useRoute();
        const eventDetails = ref(null);
        const { formatDate } = useDateFormat();

        const fetchEventDetails = async () => {
            try {
                const eventId = route.params.id; // Get the event ID from the URL parameters
                const token = localStorage.getItem('token');

                const response = await fetch(`${process.env.VUE_APP_API_URL}/events/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                eventDetails.value = await response.json();
                console.log(eventDetails)
            } catch (error) {
                console.error('There was a problem fetching the event details:', error);
            }
        };

        onMounted(fetchEventDetails);

        return {
            eventDetails,
            fetchEventDetails,
            formatDate
        }
    }
}
</script>

<style>
.event-wrapper {
    width: 90%; /* Same width as the navbar */
    margin: 20px auto; /* Centered with auto margins on the left and right, adjust top margin as needed */
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional, added for consistency with the navbar's box-shadow */
}

.event-left {
    flex-basis: 50%; /* Adjust as needed */
    background-color: #e74c3c;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.event-right {
    flex-basis: 50%; /* Adjust as needed */
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.event-left h1, .event-left h2, .event-left p {
    margin: 0;
    margin-bottom: 10px;
}

.details-organizer h2, .interest h2 {
    margin-top: 0;
}

.details-organizer p, .interest p {
    margin: 0;
}
</style>

