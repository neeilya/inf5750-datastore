<template>
    <div v-md-theme="'default'">
        <app-header></app-header>

        <div class="container content">
            <router-view></router-view>
        </div>
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

<style>
    .container {
        margin: 0 auto;
        width: 1000px;
        overflow: auto;
    }

    .container.content {
        padding: 20px;
    }

    .flex > .align-right {
        margin-left: auto;
    }

    .mx-0 {
        margin-left: 0;
        margin-right: 0;
    }

    .flex {
        display: flex
    }
</style>