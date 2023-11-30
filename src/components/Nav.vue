<template>
    <div v-if="isAuthenticated" class="navbar">
        <div class="logo">
            <router-link :to="{ name: 'Homepage' }">
                <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9H21M7 3V5M17 3V5M11.9976 12.7119C11.2978 11.9328 10.1309 11.7232 9.25414 12.4367C8.37738 13.1501 8.25394 14.343 8.94247 15.1868C9.33119 15.6632 10.2548 16.4983 10.9854 17.1353C11.3319 17.4374 11.5051 17.5885 11.7147 17.6503C11.8934 17.703 12.1018 17.703 12.2805 17.6503C12.4901 17.5885 12.6633 17.4374 13.0098 17.1353C13.7404 16.4983 14.664 15.6632 15.0527 15.1868C15.7413 14.343 15.6329 13.1426 14.7411 12.4367C13.8492 11.7307 12.6974 11.9328 11.9976 12.7119ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </router-link>
        </div>

        <button @click="toggleMenu" class="hamburger-btn">
            ☰
        </button>
        
        <div :class="{ 'hidden': !showMenu, 'nav-links': true }">
            <router-link v-for="name in pageNames" :key="name" :to="{ name: name }" class="nav-item" @click="toggleMenu">{{ name }}</router-link>
            <router-link v-if="isAuthenticated" to="{ name: 'Login' }" class="nav-item mobile-logout" @click="logoutAndToggleMenu">Logout</router-link>
        </div>


        <button class="logout" @click="logout">
            <svg width="40px" height="40px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M627.62 901.4H265.23c-56.91 0-103.05-46.14-103.05-103.05V262.8c0-56.91 46.14-103.05 103.05-103.05h362.38c56.91 0 103.04 46.13 103.04 103.04v34.78c0 15.26-12.37 27.63-27.63 27.63s-27.63-12.37-27.63-27.63V262.8c0-26.39-21.39-47.79-47.79-47.79H265.23c-26.39 0-47.78 21.39-47.78 47.78v535.57c0 26.39 21.39 47.77 47.77 47.77h362.39c26.39 0 47.77-21.39 47.77-47.77V769.6c0-15.26 12.37-27.63 27.63-27.63s27.63 12.37 27.63 27.63v28.76c0.02 56.91-46.12 103.04-103.02 103.04z" />
                <path fill="#FFFFFF" d="M853.72 508.65L731.19 386.12c-10.79-10.79-28.29-10.79-39.08 0s-10.79 28.29 0 39.08l75.18 75.18 1.17 1.12h-301c-15.26 0-27.63 12.37-27.63 27.63s12.37 27.63 27.63 27.63h299.09l-83.76 83.76c-10.86 10.86-9.69 27.27 2.59 36.48 12.28 9.21 31.21 7.87 42.07-2.99l126.28-126.28c10.79-10.79 10.79-28.28-0.01-39.08z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            pageNames: [
                'Homepage',
                'Saved Events',
                'Profile',
                'Calendar',
                'Messaging',
                'Settings',
                'Organization',
                'Events'
            ],
            showMenu: false
        };
    },
    computed: {
        ...mapGetters(['isAuthenticated']),
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        logout() {
        this.$store.commit('clearToken');

        this.$router.push({ name: 'Login' });
        }
    }
}
</script>


<style>
div.navbar {
    background-color: #2c3e50;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    margin-bottom: auto;
    padding-top: 5px;
    padding-bottom: 5px;
}

svg {
    margin-left: auto;
    cursor: pointer;
}

div.navbar a {
    text-decoration: none;
    color: #ecf0f1;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.3s ease, color 0.3s ease;
}

div.navbar a:hover {
    background-color: #34495e; 
    color: #ffffff;
}

div.nav-links a.nav-item.router-link-active {
    background-color: #e74c3c;
    color: #ffffff;
}

.hamburger-btn {
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #ecf0f1;
    display: none;
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
    display: none;
    align-self: center;
    margin-right: auto;
}

div.navbar > div {
    display: flex; 
    flex-wrap: wrap;
}

div.nav-links {
    display: flex;
    justify-content: center;
    flex-grow: 1;
}

.logout {
    background: transparent;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    color: #ffffff;
    margin-right: 20px;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.logout:hover {
    background: #e74c3c;
}

.mobile-logout {
        display: none;
}

@media (max-width: 768px) {
    div.navbar {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .hamburger-btn {
        display: block;
        align-self: flex-start; 
    }

    div.navbar > div {
        width: 100%; 
        display: none; 
    }

    div.navbar > div:not(.hidden) {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .navbar .logo {
        display: none !important;
    }

    .navbar .logout {
        display: none !important;
    }

    .mobile-logout {
            display: block;
    }
}

</style>