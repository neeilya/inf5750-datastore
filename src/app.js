import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './app.vue';
import routes from './routes';

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes
});

const app = new Vue({
    router: router,
    render: h => h(App)
});

app.$mount('#app');