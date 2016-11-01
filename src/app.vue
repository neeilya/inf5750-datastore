<template>
    <div class="body" v-md-theme="'default'">
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
            //
        },
        components: {
            'app-header': appHeader
        }
    }
</script>

<style>
    body {
        background: #dddddd;
    }

    .md-toolbar {
        min-height: 0;
    }

    .action-button {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }

    .action-button.right {
        right: 16px;
        bottom: 24px;
    }

    .h3 {
        font-size: 120%;
    }

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
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .flex {
        display: flex
    }

    .col-6 {
        width: 50%;
        padding: 0 10px;
    }

    .md-accent {
        color: #fff !important;
    }
</style>