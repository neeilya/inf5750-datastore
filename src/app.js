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

Vue.material.theme.register('default', {
  primary: 'blue-grey',
  accent: 'white'
});

const router = new VueRouter({
    routes: routes
});

const app = new Vue({
    router: router,
    render: h => h(App)
});

app.$mount('#app');