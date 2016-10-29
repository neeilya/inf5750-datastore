import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './app.vue';

Vue.use(VueResource);

const app = new Vue({
    render: h => h(App)
});

app.$mount('#app');