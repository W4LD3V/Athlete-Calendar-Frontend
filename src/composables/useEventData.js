import { ref, onMounted } from 'vue';

export default function useEventData() {
    const eventData = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchEventData = async () => {
        isLoading.value = true;
        error.value = null;
        
        try {
            const response = await fetch(process.env.VUE_APP_API_URL + "/events");
            if (!response.ok) {
                throw new Error("Failed to fetch events from the server");
            }
            const data = await response.json();
            eventData.value = data;
        } catch (err) {
            console.error("Error fetching events:", err);
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }

        // console.log("Fetched events inside fetch function:", eventData.value);

    };

    // Within the useEventData function
    // console.log("Fetched events:", eventData.value);
    // console.log("Loading state:", isLoading.value);
    // console.log("Error:", error.value);


    // Fetch the data when this composable is used.
    onMounted(fetchEventData);

    return {
        eventData,
        isLoading,
        error,
        fetchEventData
    };
}
