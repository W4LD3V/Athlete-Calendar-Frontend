import { ref } from 'vue';
import { useStore } from 'vuex';

export default function useSaveUnsaveEvents() {
    const store = useStore();

    const saveEvent = async (eventId) => {
        const userId = store.state.userId;

        try {
            const response = await fetch(process.env.VUE_APP_API_URL + "/save-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.state.token}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    event_id: eventId
                })
            });

            if (!response.ok) {
                throw new Error("Failed to save the event.");
            }
            return true;
        } catch (error) {
            console.error("Error saving the event:", error);
            return false;
        }
    };

    const unsaveEvent = async (eventId) => {
        const userId = store.state.userId;

        try {
            const response = await fetch(process.env.VUE_APP_API_URL + `/unsave-event/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.state.token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to unsave the event.");
            }
            return true;
        } catch (error) {
            console.error("Error unsaving the event:", error);
            return false;
        }
    };

    return {
        saveEvent,
        unsaveEvent
    }
}
