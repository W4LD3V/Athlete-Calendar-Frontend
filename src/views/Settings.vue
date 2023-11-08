<template>
  <div id="app">
    <h1>User Settings</h1>
    
    <div v-if="userSettings">
      <p><strong>Notifications:</strong> {{ userSettings.notifications }}</p>
      <p><strong>Privacy:</strong> {{ userSettings.privacy }}</p>
      
      <button @click="toggleNotifications">Toggle Notifications</button>
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
    }
  },
  created() {
    this.fetchUserSettings();
  }
};
</script>

<style>

</style>
