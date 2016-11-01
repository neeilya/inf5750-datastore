<template>
    <md-toolbar>
        <div class="flex container">
            <h2 class="md-title">
                <router-link to="/">
                    <md-button class="mx-0">Data Store Manager</md-button>
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
                        <img class="logo" width="20" src="assets/img/dhis2.png">
                    </md-button>
                </a>
            </h2>
        </div>
    </md-toolbar>
</template>

<style scoped>
    .md-toolbar {
        min-height: 0;
    }

    .md-theme-default .md-toolbar, .md-theme-default.md-toolbar {
        background-color: #37474F;
    }

    .md-button {
        padding-bottom: 13px;
        padding-top: 13px;
        margin-top: 0;
        margin-bottom: 0;
    }

    .logo {
        width: 65px;
        position: relative;
        bottom: 3px;
    }
</style>