<template>
    <div>
        <app-header></app-header>

        <router-view></router-view>
    </div>
</template>

<script>
    import appHeader from './components/app-header.vue';

    export default {
        created() {
            console.log('Hello world!');
        },
        components: {
            'app-header': appHeader
        }
    }
</script>