import { createRouter, createWebHistory } from "vue-router";
import store from '../src/store/index'

import Home from '../src/views/Home.vue';
import Saved from '../src/views/Saved.vue';
import Profile from '../src/views/Profile.vue'; 
import Messaging from '../src/views/Messaging.vue';
import Settings from '../src/views/Settings.vue';
import EventDetails from '../src/views/EventDetails';
import NotFound from '../src/views/NotFound';
// import Login from '../src/views/Login;'
// import Signup from '../src/views/Signup;'
import Calendar from '../src/views/Calendar';
import ChangePassword from '../src/views/ChangePassword';
import Chat from '../src/views/Chat';
import Auth from '../src/views/Auth'
import CreateOrganization from '../src/views/CreateOrganization'
import OrganizationEvents from '../src/views/OrganizationEvents'
import CreateEvent from '../src/views/CreateEvent'
import Organization from '../src/views/Organization'
import ChangeOrganizationCredentials from '../src/views/ChangeOrganizationCredentials'


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
        name: 'Calendar',
        component: Calendar
    },
    {
        path: '/profile',
        name: 'Profile',
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
        path: '/password-change',
        name: 'Change Password',
        component: ChangePassword
    },
    {
        path: '/create-organization',
        name: 'Create Organization',
        component: CreateOrganization
    },
    {
        path: '/change-organization-credentials',
        name: 'Change Organization Credentials',
        component: ChangeOrganizationCredentials
    },
    {
        path: '/organization-events',
        name: 'Events',
        component: OrganizationEvents
    },
    {
        path: '/create-event',
        name: 'Create Event',
        component: CreateEvent
    },
    {
        path: '/my-organization',
        name: 'Organization',
        component: Organization
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
    },
    {
        path: '/auth',
        component: Auth,
        children: [
          {
            path: 'login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "auth" */ '../src/components/LoginForm.vue')
          },
          {
            path: 'signup',
            name: 'Signup',
            component: () => import(/* webpackChunkName: "auth" */ '../src/components/SignupForm.vue')
          }
        ]
    },
      
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = ['Login', 'Signup'];
    const authRequired = !publicPages.includes(to.name);
    const loggedIn = store.getters.isAuthenticated;
  
    if (authRequired && !loggedIn) {
      next({ name: 'Login' });
    } else {
      next();
    }
  });  
  

export default router