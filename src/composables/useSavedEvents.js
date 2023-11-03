import { ref } from 'vue';
import { useStore } from 'vuex';

export default function useSavedEvents() {
    const store = useStore();
    const savedEvents = ref({});
    
    const fetchSavedEvents = async () => {
        try {
            const response = await fetch("http://localhost:3000/saved-events", {
                headers: {
                    "Authorization": `Bearer ${store.state.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch saved events.");
            }

            const savedEventData = await response.json();
            savedEventData.forEach(event => {
                savedEvents.value[event.id] = true; // Use event.id here because each event is an object
            });            

        } catch (error) {
            console.error("Error fetching saved events:", error);
        }
    };

    return {
        savedEvents,
        fetchSavedEvents
    };
}
