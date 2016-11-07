import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import App from './app.vue';
import routes from './routes';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueMaterial);

// Binding new instance to $events property to properly manipulate
// events globally across components
Vue.prototype.$events = new Vue;

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