<template>
    <div>
      <h2 class="white-title">Chat with {{ friendName.name }}</h2>
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
        newMessage: '',
        friendName: ''
      };
    },
    created() {
      this.friendId = this.$route.params.friendId;
      this.retrieveMessages();
      this.retrieveFriendName();
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
      async retrieveFriendName() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
  
          const response = await fetch(`http://localhost:3000/friend-information/${this.friendId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          this.friendName = await response.json();
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
  
  <style scoped>
  div {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: auto;
  }

  h2 {
    color: #333;
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
    max-height: 400px;
    overflow-y: auto;
  }

  ul li {
    list-style: none;
    background-color: #fff;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  ul li strong {
    color: #1a73e8;
    font-weight: bold;
  }

  small {
    display: block;
    margin-top: 8px;
    color: #666;
    font-size: 12px;
  }

  input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }

  button {
    padding: 10px 15px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0f62a4;
  }

  .white-title {
    color: #ecf0f1;
  }
</style>

  