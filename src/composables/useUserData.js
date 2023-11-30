import { ref } from 'vue';
import { useStore } from 'vuex';

export default function useUserData() {
    const store = useStore();
    const userData = ref({});
    
    const fetchUserData = async () => {
        try {
            const response = await fetch(process.env.VUE_APP_API_URL + "/user", {
                headers: {
                    "Authorization": `Bearer ${store.state.token}`
                }
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }
    
            userData.value = await response.json();
    
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };    

    return {
        userData,
        fetchUserData
    };
}
