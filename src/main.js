import './style.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';

import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import { plugin, defaultConfig } from '@formkit/vue'
import {useToast} from 'vue-toast-notification';
import config from '../formkit.config';

import App from './App.vue';
import router from './routes/routes';

import "vue-toast-notification/dist/theme-sugar.css"

const toast = useToast({
    duration: 3000,
    position: 'top-right'
})

const pinia = createPinia();
pinia.use(({ store }) => {
    store.router = markRaw(router);
})

const app = createApp(App)

app.provide('toast', toast)
app.use(router)
app.use(pinia)
app.use(plugin, defaultConfig(config))
app.mount('#app')
