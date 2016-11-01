<template>
    <div class="flex">
        <div class="col-6">
            <browser></browser>
        </div>
        <div class="col-6">
            <editor></editor>
        </div>
    </div>
</template>

<script>
    import browser from '../components/browser.vue';
    import editor from '../components/editor.vue';

    export default {
        data() {
            return {

            }
        },
        created() {
            console.log('this is home page');
        },
        components: {
            browser,
            editor
        }
    }
</script>

<style scoped>
    /* Scoped local styles */
</style>