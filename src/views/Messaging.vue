<template>
  <div class="form">
    <div class="search-users">
      <h2>Search Users</h2>
      <input type="text" v-model="searchQuery" placeholder="Enter name or email" />
      <button class="search" @click="searchUsers">Search</button>
      <ul>
        <li class="friend-search" v-for="user in searchedUsers" :key="user.id">
          {{ user.name }} ({{ user.email }})
          <button @click="sendFriendRequest(user.id)">Add Friend</button>
        </li>
      </ul>
    </div>
    <div class="friends">
      <div>
        <h2>Friend Requests</h2>
        <ul>
          <li v-for="request in friendRequests" :key="request.id">
            {{ request.sender_name }}
            <button @click="acceptFriendRequest(request.sender_id)">Accept</button>
          </li>
        </ul>
      </div>
  
      <div>
          <h2>Friends</h2>
          <ul>
            <li v-for="friend in friends" :key="friend.id">
              <router-link class="my-friend" :to="{ name: 'Chat', params: { friendId: friend.id } }">
                {{ friend.name }} ({{ friend.email }})
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const searchQuery = ref('');
const searchedUsers = ref([]);
const friendRequests = ref([]);
const friends = ref([]);

const searchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/search-users?query=${searchQuery.value}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      searchedUsers.value = data;
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    console.error(error);
  }
};


const sendFriendRequest = async (friendId) => {
  try {
    const token = localStorage.getItem('token'); // Assuming the token is stored with the key 'token'
    const response = await fetch('http://localhost:3000/send-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      },
      body: JSON.stringify({ friendId }),
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    alert('Friend request sent!');
  } catch (error) {
    alert(error.message);
  }
};

const acceptFriendRequest = async (friendId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/accept-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ friendId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    alert('Friend request accepted!');
  } catch (error) {
    alert(error.message);
  }
};

const fetchFriendRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/friend-requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      friendRequests.value = data;
    } else {
      throw new Error('Failed to fetch friend requests');
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchFriends = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/friends', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      friends.value = data;
      console.log(friends.value)
    } else {
      throw new Error('Failed to fetch friends');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchFriendRequests();
  fetchFriends();
});
</script>

<style scoped>
/* General Styles */

.form {
  margin: 30px auto; /* Centers the form horizontally */
  padding: 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: grid; 
  grid-template-columns: repeat(2, 1fr); /* Equal columns */
  gap: 10px;
}


/* Input and Button Styles */
input, select {
  padding: 12px 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fff;
  color: #333;
}

.search, button {
  background-color: #e74c3c; /* A more chat-like button color */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 14px;
}

.search:hover, button:hover {
  background-color: #e74c3c;
}

/* Section Styles */
h2 {
  color: #333;
  margin-bottom: 15px;
}

ul {
  padding: 0;
  list-style-type: none;
}

li {
  margin-bottom: 10px;
}

/* Link Styles */
router-link {
  color: #e74c3c;
  text-decoration: none;
}

.my-friend{
  text-decoration: none;
  color: inherit
}




</style>