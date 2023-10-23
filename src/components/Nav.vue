<template>
    <div class="navbar">
        <button @click="toggleMenu" class="hamburger-btn">
            ☰
        </button>
        <div :class="{ 'hidden': !showMenu }">
            <router-link v-for="name in pageNames" :key="name" :to="{ name: name }">{{ name }}</router-link>
        </div>
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
            ],
            showMenu: false
        };
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
        }
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

.hamburger-btn {
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #ecf0f1;
    display: none;  /* Initially hidden */
}

.hidden {
    display: none;
}

.hamburger-btn {
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #ecf0f1;
    display: none;  /* Initially hidden on larger screens */
    align-self: center;
    margin-right: auto;
}

/* Menu Container (Holds the links) */
div.navbar > div {
    display: flex;  /* By default, it should display on larger screens */
    flex-wrap: wrap;  /* Allow links to wrap if they don't fit */
}

/* Media query for mobile view */
@media (max-width: 768px) {
    div.navbar {
        flex-direction: column;
        align-items: flex-start;  /* Align to the start (left) */
        padding-left: 15px;  /* Give some space from the left */
    }

    .hamburger-btn {
        display: block;  /* Show the button on small screens */
        align-self: flex-start;  /* Align the button to the start (left) */
    }

    div.navbar > div {
        width: 100%;  /* Take the full width of its parent */
        display: none;  /* Hide the links initially */
    }

    div.navbar > div:not(.hidden) {
        display: flex;  /* Show the links when showMenu is true */
        flex-direction: column;
        width: 100%;
    }
}

</style>