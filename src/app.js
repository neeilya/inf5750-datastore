import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import VueMoment from 'vue-moment';
import 'vue-material/dist/vue-material.css';
import EventEmitter from 'events';
import App from './app.vue';
import routes from './routes';
import filters from './filters';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(VueMoment);

filters.register();

// Binding EventEmitter to $events property to properly manipulate
// events globally across components
Vue.prototype.$events = new EventEmitter;

// Setting http headers
Vue.http.headers.common['Accept'] = 'application/json';
Vue.http.headers.common['Content-Type'] = 'application/json';
Vue.http.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Registering global theme
Vue.material.theme.register('default', {
    primary: {
        color: 'blue-grey',
        hue: 800
    },
    accent: 'white',
    warn: 'teal'
});

// Creating router instance
const router = new VueRouter({
    routes: routes
});

// Registering global App component
const app = new Vue({
    router: router,
    render: h => h(App)
});

// Binding global Vue component to element with app id
app.$mount('#app');