<template>
    <md-card>
        <md-toolbar>
            <span class="h3">Explorer</span>
        </md-toolbar>
        <md-card-content>
            <p>this is browser component content</p>
            <p>this is browser component content</p>

            <md-button class="md-icon-button md-raised md-warn action-button mx-0">
                <md-icon>add</md-icon>
                <md-tooltip md-direction="top">Create item/namespace</md-tooltip>
            </md-button>
        </md-card-content>
    </md-card>
</template>

<script>
    export default {
        created() {
            console.log('browser component has been rendered!');
        }
    }
</script>

<style scoped>
    .md-toolbar {
        padding: 15px;
    }
</style>