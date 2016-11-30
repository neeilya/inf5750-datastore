<template>
    <div class="flex">
        <div class="col browser-container">
            <browser></browser>
        </div>
        <div class="col editor-container">
            <editor></editor>
        </div>
    </div>
</template>

<script>
    import browser from 'components/browser.vue';
    import editor from 'components/editor.vue';

    export default {
        data() {
            return {
                //
            }
        },
        created() {
            //
        },
        components: {
            browser,
            editor
        }
    }
</script>

<style scoped>
    .col {
        padding: 0 10px;
    }
    .browser-container {
        width: 50%;
        max-width: 375px;
    }

    .editor-container {
        width: calc(100% - 375px);
        padding-right: 0;
    }
    .md-card {
        min-height: 500px;
    }
</style>