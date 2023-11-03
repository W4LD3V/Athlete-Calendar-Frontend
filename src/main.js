// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from '../router/index'; // Updated import path
import store from './store';

const token = localStorage.getItem('token');
if (token) {
    store.commit('setToken', token);
}

createApp(App)
    .use(store)
    .use(router)
    .mount('#app');
