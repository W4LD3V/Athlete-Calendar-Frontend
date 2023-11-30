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
import { useStore } from 'vuex';

export default {
    setup(props, { emit }) {
        const router = useRouter();
        const store = useStore();

        const closeDeleteModal = () => {
            emit('close');
        };

        const confirmDeletion = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(process.env.VUE_APP_API_URL + "/remove-organization", {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to delete the account");
                }

                closeDeleteModal();
                router.push("/create-organization");
            } catch (error) {
                console.error("Error deleting organization:", error);
            }
        };

        return {
            closeDeleteModal,
            confirmDeletion
        };
    }
}
</script>


<style scoped>
  .modal {
    width: 400px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    margin: auto;
    position: relative;
    text-align: center;
  }
  .backdrop {
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
