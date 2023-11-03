import { ref, onMounted } from 'vue';

export default function useEventData() {
    const eventData = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const fetchEventData = async () => {
        isLoading.value = true;
        error.value = null;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.VUE_APP_API_URL + "/events", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch events from the server");
            }
            const data = await response.json();
            eventData.value = data;
            // console.log(data)
        } catch (err) {
            console.error("Error fetching events:", err);
            error.value = err.message;
        } finally {
            isLoading.value = false;
        }

    };


    // Fetch the data when this composable is used.
    onMounted(fetchEventData);

    return {
        eventData,
        isLoading,
        error,
        fetchEventData
    };
}
