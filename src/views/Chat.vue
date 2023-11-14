<template>
    <div>
      <h2>Chat with {{ friendId }}</h2>
      <ul>
        <li v-for="message in messages" :key="message.id">
          <strong>{{ message.sender_name }} {{ message.sender_surname }}:</strong> {{ message.message }}
          <br>
          <small>{{ formatTimestamp(message.timestamp) }}</small>
        </li>
      </ul>
      <div>
        <input v-model="newMessage" placeholder="Type a message" />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        friendId: null,
        messages: [],
        newMessage: ''
      };
    },
    created() {
      this.friendId = this.$route.params.friendId;
      this.retrieveMessages();
    },
    methods: {
      async retrieveMessages() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
  
          const response = await fetch(`http://localhost:3000/retrieve-messages?friendId=${this.friendId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          this.messages = await response.json();
        } catch (error) {
          console.error('Error retrieving messages:', error);
        }
      },
      formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
      },
      async sendMessage() {
        const token = localStorage.getItem('token');
        if (!this.newMessage.trim()) return;
        try {
          const response = await fetch(`http://localhost:3000/send-message`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              receiver_id: this.friendId,
              message: this.newMessage
            })
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          this.newMessage = ''; // Clear the input field
          this.retrieveMessages(); // Refresh messages
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    }
  }
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  