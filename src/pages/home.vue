<template>
    <div class="flex">
        <div class="col-4">
            <browser></browser>
        </div>
        <div class="col-8">
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
    .md-card {
        min-height: 500px;
    }
</style>