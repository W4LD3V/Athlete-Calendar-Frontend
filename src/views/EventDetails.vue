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
        <div>
            <h1>Organizer</h1>
            <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].organizer_name }}</p>
        </div>
        <div class="interest">
            <h1>Interest</h1>
            <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].saved_count }} people saved this event</p>
            <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].friends_saved_count }} friends saved this event</p>
        </div>
        <div>
            <h1>Details</h1>
            <p v-if="eventDetails && eventDetails[0]">{{ eventDetails[0].description }}</p>
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
                const eventId = route.params.id;
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
    width: 90%;
    margin: 20px auto;
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-left {
    flex-basis: 50%;
    background-color: #e74c3c;
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.event-right {
    flex-basis: 50%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #ecf0f1;
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

