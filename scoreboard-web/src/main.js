import { createApp } from 'vue';

import router from './router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const Vuetify = createVuetify({
    components,
    directives
});

// Vuesax
import Vuesax from 'vuesax-alpha';
import 'vuesax-alpha/theme-chalk/index.css';
import 'vuesax-alpha/theme-chalk/dark/css-vars.css';

// Global CSS
import './style.css';

// App
import App from './App.vue';

const app = createApp(App)
    .use(router)
    .use(Vuetify)
    .use(Vuesax, {
        colors: {
            primary: 'rgb(36, 159, 253)',
            success: 'rgb(23, 201, 100)',
            danger: 'rgb(242, 19, 93)',
            warning: 'rgb(255, 130, 0)',
            dark: 'rgb(36, 33, 69)'
        }
    })
    .mount('#app');
