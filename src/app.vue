<template>
    <div>
        <header>
            <router-link to="/">Main</router-link>
            <router-link to="statistics">Statistics</router-link>
            <router-link to="about">About</router-link>
        </header>

        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        created() {
            console.log('Hello world!');
        }
    }
</script>