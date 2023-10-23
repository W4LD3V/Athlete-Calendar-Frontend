<template>
    <div class="navbar">
        <router-link v-for="name in pageNames" :key="name" :to="{ name: name }">{{ name }}</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageNames: [
                'Homepage',
                'Saved Events',
                'Upcoming Events',
                'My Profile',
                'Messaging',
                'Settings'
            ]
        };
    }
}
</script>

<style>

/* Navbar Container */
div.navbar {
    background-color: #2c3e50;  /* Using the same color from your app style for consistency */
    padding: 10px 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    width: 90%;
    display: flex;
    justify-content: space-around;
    margin-top: 0;
    margin-bottom: auto;
}

/* Individual Link styling */
div.navbar a {
    text-decoration: none;  /* Removes the underline from the link */
    color: #ecf0f1;         /* Light color for contrast against the dark navbar */
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition effect for hover */
}

/* Link hover styling */
div.navbar a:hover {
    background-color: #34495e;  /* Slightly darker shade for hover */
    color: #ffffff;
}

/* Active Link styling - Assuming Vue router sets 'router-link-active' class */
div.navbar a.router-link-active {
    background-color: #e74c3c;  /* Red color to signify active page */
    color: #ffffff;
}


</style>