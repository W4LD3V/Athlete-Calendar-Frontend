<template>
    <div class="navbar">
        <!-- SVG Logo -->
        <div class="logo">
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9H21M7 3V5M17 3V5M11.9976 12.7119C11.2978 11.9328 10.1309 11.7232 9.25414 12.4367C8.37738 13.1501 8.25394 14.343 8.94247 15.1868C9.33119 15.6632 10.2548 16.4983 10.9854 17.1353C11.3319 17.4374 11.5051 17.5885 11.7147 17.6503C11.8934 17.703 12.1018 17.703 12.2805 17.6503C12.4901 17.5885 12.6633 17.4374 13.0098 17.1353C13.7404 16.4983 14.664 15.6632 15.0527 15.1868C15.7413 14.343 15.6329 13.1426 14.7411 12.4367C13.8492 11.7307 12.6974 11.9328 11.9976 12.7119ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <button @click="toggleMenu" class="hamburger-btn">
            ☰
        </button>
        
        <div :class="{ 'hidden': !showMenu, 'nav-links': true }">
            <router-link v-for="name in pageNames" :key="name" :to="{ name: name }">{{ name }}</router-link>
        </div>
        
        <button class="logout" @click="logout">Logout</button>

    </div>
</template>

<!-- LOG OUT -->
<!-- localStorage.removeItem('token'); -->

<script>

export default {
    data() {
        return {
            pageNames: [
                'Homepage',
                'Saved Events',
                'My Profile',
                'My Calendar',
                'Messaging',
                'Settings'
            ],
            showMenu: false
        };
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        logout(){
            // Remove the token from localStorage
            localStorage.removeItem('token');

            // Programmatically navigate to the /login route
            this.$router.push({ name: 'Login' });
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
    justify-content: flex-start; /* Align items to the start */
    align-items: center; /* Align items vertically in the center */
    margin-top: 0;
    margin-bottom: auto;
}

svg {
    margin-left: auto; /* Pushes the logo to the far right */
    cursor: pointer;
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

.logo {
    margin-right: auto; /* Pushes everything else to the right */
    margin-left: 20px;
}

.nav-links {
    position: absolute; /* Absolute positioning */
    left: 50%;         /* Start from the middle */
    transform: translateX(-50%); /* Shift back by half its own width */
    display: flex;
}

.logout {
    background: transparent;
    border-radius: 8px;
    padding: 10px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #ffffff;
    margin-right: 20px;
    transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition effect for hover */
}

.logout:hover {
    background: #e74c3c;
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
    .nav-links {
        position: static; /* Disable absolute positioning on mobile */
        transform: none; /* Remove the transform */
    }
}


</style>