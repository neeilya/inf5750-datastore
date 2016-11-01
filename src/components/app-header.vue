<template>
    <md-toolbar>
        <div class="flex container">
            <h2 class="md-title">
                <router-link to="/">
                    <md-button class="mx-0">
                        <img class="primary-logo" src="assets/img/logo.png" />
                        Data Store Manager
                    </md-button>
                </router-link>
            </h2>
            <h2 class="md-title">
                <router-link to="/statistics">
                    <md-button class="mx-0">Statistics</md-button>
                </router-link>
            </h2>
            <h2 class="md-title">
                <router-link to="/about">
                    <md-button class="mx-0">About</md-button>
                </router-link>
            </h2>
            <h2 class="md-title align-right">
                <a href="/">
                    <md-button class="mx-0">
                        <img class="logo" src="assets/img/dhis2.png">
                    </md-button>
                </a>
            </h2>
        </div>
    </md-toolbar>
</template>

<style scoped>
    .md-button {
        padding-bottom: 13px;
        padding-top: 13px;
        margin-top: 0;
        margin-bottom: 0;
        text-transform: none;
    }

    .primary-logo {
        width: 30px;
        margin-right: 5px;
        position: relative;
        bottom: 2px;
    }

    .logo {
        width: 65px;
        position: relative;
        bottom: 3px;
    }
</style>