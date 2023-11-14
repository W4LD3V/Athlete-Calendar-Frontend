<template>
    <div class="backdrop" @click.self="closeDeleteModal">
        <div class="modal">
            <p>Are you sure you want to delete your account?</p>
            <slot name="eventTitle"></slot>
            <button @click="confirmDeletion">Yes</button>
            <button @click="closeDeleteModal">No</button>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // Import useStore

export default {
    setup(props, { emit }) {
        const router = useRouter();
        const store = useStore(); // Get the store instance

        const closeDeleteModal = () => {
            emit('close');
        };

        const confirmDeletion = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:3000/remove-user", {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to delete the account");
                }

                // Clear the token from Vuex and localStorage
                store.dispatch('logout'); // Dispatch the logout action

                // Close the modal and redirect to login
                closeDeleteModal();
                router.push("/auth/login");
            } catch (error) {
                console.error("Error deleting account:", error);
                // Handle error
            }
        };

        return {
            closeDeleteModal,
            confirmDeletion
        };
    }
}
</script>


<style>
  .modal {
    width: 400px;
    padding: 20px;
    margin: 200px auto;
    background: white;
    border-radius: 10px;
  }
  .backdrop {
    top: 0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
  }
</style>