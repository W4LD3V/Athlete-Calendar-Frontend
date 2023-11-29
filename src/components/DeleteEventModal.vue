<template>
    <div class="backdrop" @click.self="closeDeleteModal">
      <div class="modal">
        <p>Are you sure you want to delete this event?</p>
        <slot></slot> <!-- Use a default slot without specifying a name -->
        <button @click="confirmDelete">Yes</button>
        <button @click="closeDeleteModal">No</button>
      </div>
    </div>
  </template>
      
  <script>
  import { ref, useStore } from 'vue'; // Remove one of the useRouter imports
  
  export default {
    props: {
      eventId: String,
    },
    setup(props, { emit }) {
      const closeDeleteModal = () => {
        emit('close');
      };
  
      const confirmDelete = async () => {
        const deleted = await deleteEvent(props.eventId);
        if (deleted) {
          emit('event-deleted');
        }
        closeDeleteModal();
      };
  
      const store = useStore();
  
      const deleteEvent = async () => {
        const eventId = props.eventId;
  
        try {
          const response = await fetch(`http://localhost:3000/organization-events/${eventId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${store.state.token}`
            }
          });
  
          if (!response.ok) {
            throw new Error("Failed to delete the event.");
          }
  
          // You can trigger an event to notify the parent component to refresh events here if needed
  
          return true;
        } catch (error) {
          console.error("Error deleting the event:", error);
          return false;
        }
      };
  
      return {
        closeDeleteModal,
        deleteEvent
      };
    }
  }
  </script>
  
  



<style scoped>
.modal {
  width: 400px;
  padding: 20px;
  margin: 200px auto;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center; /* Center text horizontally */

  /* Add space between the buttons */
  gap: 10px;
}

.modal button {
  width: auto; /* Allow buttons to expand to fit content */
}

/* Style the buttons */
.modal button:nth-child(1) {
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal button:nth-child(2) {
  background-color: #2c3e50;
  color: #ecf0f1;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Style on hover */
.modal button:hover {
  filter: brightness(1.2); /* Add a hover effect */
}

.backdrop {
    top: 0;
    left: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Make sure it's above other elements */
}
</style>
