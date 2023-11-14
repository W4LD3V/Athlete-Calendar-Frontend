<template>
  <div>
    <h1>User Settings</h1>
    
    <div v-if="userSettings">
      <p><strong>Notifications:</strong> {{ userSettings.notifications }}</p>
      <button @click="toggleNotifications">Toggle Notifications</button>
      <p><strong>Privacy:</strong> {{ userSettings.privacy }}</p>
      <button @click="togglePrivacy">
          {{ userSettings.privacy === 'PUBLIC' ? 'Set to Not Public' : 'Set to Public' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      userSettings: null
    };
  },
  methods: {
    async fetchUserSettings() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/user-settings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.userSettings = await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    async toggleNotifications() {
      try {
        const updatedSettings = {
          ...this.userSettings,
          notifications: !this.userSettings.notifications
        };
        
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/update-user-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedSettings)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        this.fetchUserSettings();
      } catch (error) {
        console.error(error);
      }
    },

      async togglePrivacy() {
      const newPrivacyStatus = this.userSettings.privacy === 'PUBLIC' ? 'NOT PUBLIC' : 'PUBLIC';

      try {
        const updatedSettings = {
          ...this.userSettings,
          privacy: newPrivacyStatus
        };

        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/update-user-settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedSettings)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        this.fetchUserSettings();

      } catch (error) {
        console.error(error);
      }
    }
  
  },
  created() {
    this.fetchUserSettings();
  }
};
</script>

<style scoped>

button {
  background-color: #e74c3c;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
}
</style>
