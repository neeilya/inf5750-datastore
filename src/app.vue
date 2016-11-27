<template>
    <div class="body" v-md-theme="'default'">
        <app-header></app-header>

        <div class="container content">
            <notifications></notifications>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import appHeader from 'components/app-header.vue';
    import notifications from 'components/notifications.vue';

    export default {
        components: {
            'app-header': appHeader,
            'notifications': notifications
        }
    }
</script>

<style lang="sass">
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
        position: relative;
        margin: 0 auto;
        width: 1000px;
        overflow: auto;
    }

    .pull-right {
        float: right;
    }

    .container.content {
        padding: 20px;
    }

    .flex > .align-right {
        margin-left: auto;
    }

    .my-0 {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
    }

    .mx-0 {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }

    .flex {
        display: flex
    }

    .col-4, .col-6, .col-8 {
        padding: 0 10px;
    }

    .col-6 {
        width: 50%;
    }

    .col-4 {
        width: 33.333%;
    }

    .col-8 {
        width: 66.666%;
    }

    .text-center {
        text-align: center;
    }

    .md-icon.md-accent {
        color: #fff !important;
    }

    .md-button.md-danger {
        background-color: #EF5350;

        &.md-button:hover:not([disabled]).md-raised,
        &.md-button.md-icon-button:not([disabled]):hover,
        &:hover {
            background-color: #da4d4a;
        }
    }

    .md-button.md-violet {
        background-color: #6639b6;

        &.md-button:hover:not([disabled]).md-raised,
        &.md-button.md-icon-button:not([disabled]):hover,
        &:hover {
            background-color: #5e34a7;
        }
    }

    [v-cloak] {
        display: none;
    }

    .md-card .md-toolbar {
        padding: 15px;
    }

    fieldset {
        display: block;
        -webkit-margin-start: 0;
        -webkit-margin-end: 0;
        -webkit-padding-before: 0;
        -webkit-padding-start: 0;
        -webkit-padding-end: 0;
        -webkit-padding-after: 0;
        min-width: -webkit-min-content;
        border: none;

        &:disabled {
            input,
            button,
            textarea {
                cursor: not-allowed;
            }

            button,
            .md-button,
            .md-button.md-danger.md-button:hover:not([disabled]).md-raised,
            .md-button.md-danger.md-button.md-icon-button:not([disabled]):hover,
            .md-button.md-danger:hover,
            .md-button.md-violet.md-button:hover:not([disabled]).md-raised,
            .md-button.md-violet.md-button.md-icon-button:not([disabled]):hover,
            .md-button.md-violet:hover,
            .md-button.md-danger {
                background-color: rgba(0,0,0,.12);
            }
        }
    }
</style>