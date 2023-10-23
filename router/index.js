import { createRouter, createWebHistory } from "vue-router";

import Home from '../src/views/Home.vue';
import Saved from '../src/views/Saved.vue';
import Upcoming from '../src/views/Upcoming.vue'; 
import Profile from '../src/views/Profile.vue'; 
import Messaging from '../src/views/Messaging.vue';
import Settings from '../src/views/Settings.vue';
import EventDetails from '../src/views/EventDetails'
import NotFound from '../src/views/NotFound'

const routes = [
    {
        path: '/',
        name: 'Homepage',
        component: Home,
        props: true
    },
    {
        path: '/saved',
        name: 'Saved Events',
        component: Saved
    },
    {
        path: '/upcoming',
        name: 'Upcoming Events',
        component: Upcoming
    },
    {
        path: '/profile',
        name: 'My Profile',
        component: Profile
    },
    {
        path: '/messaging',
        name: 'Messaging',
        component: Messaging
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings
    },
    {
        path: '/event/:id',
        name: 'EventDetails',
        component: EventDetails,
        props: true
    },
    // catch 404
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: NotFound
    }
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router