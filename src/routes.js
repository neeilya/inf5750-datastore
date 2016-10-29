import Home from './pages/home.vue';
import Statistics from './pages/statistics.vue';
import About from './pages/about.vue';

export default [
    {
        path: '/',
        component: Home
    },
    {
        path: '/statistics',
        component: Statistics
    },
    {
        path: '/about',
        component: About
    }
];