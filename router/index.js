import { createRouter, createWebHistory } from "vue-router";
import store from '../src/store/index'

import Home from '../src/views/Home.vue';
import Saved from '../src/views/Saved.vue';
import Upcoming from '../src/views/Upcoming.vue'; 
import Profile from '../src/views/Profile.vue'; 
import Messaging from '../src/views/Messaging.vue';
import Settings from '../src/views/Settings.vue';
import EventDetails from '../src/views/EventDetails'
import NotFound from '../src/views/NotFound'
import Login from '../src/views/Login'
import Signup from '../src/views/Signup'
import Calendar from '../src/views/Calendar'
import ChangePassword from '../src/views/ChangePassword'
import Chat from '../src/views/Chat'

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
        path: '/calendar',
        name: 'My Calendar',
        component: Calendar
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
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/password-change',
        name: 'Change Password',
        component: ChangePassword
    },
    {
        path: '/chat/:friendId',
        name: 'Chat',
        component: Chat,
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

router.beforeEach((to, from, next) => {
    if (to.name !== "Login" && !store.state.token) {
      next({ name: "Login" });
    } else {
      next();
    }
  });

export default router