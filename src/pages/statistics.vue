<template>
    <div>
        <div v-if="initializing" class="text-center">
            <spinner class="spinner"></spinner>
        </div>
        <div v-else>
            <md-card>
                <md-toolbar>
                    <span class="h3">Statistics</span>
                </md-toolbar>
                <md-card-content>
                    <div v-for="namespace in namespaces">
                        <pre>{{ namespace }}</pre>
                    </div>
                </md-card-content>
            </md-card>
        </div>
    </div>
</template>

<script type="text/babel">
    import spinner from 'components/assets/spinner.vue';
    import api from 'services/api';

    export default {
        data() {
            return {
                initializing: true,
                namespaces: []
            }
        },
        created() {
            this.fetch();
        },
        components: {
            spinner: spinner
        },
        methods: {
            fetch() {
                api.getAllNamespaces().then(response => {
                    response.data.forEach(namespace => {
                        this.namespaces.push({ name: namespace, keys: [] });
                    });

                    let calls = [];

                    // Fetching all namespaces keys using Promise.all()
                    // to ensure they all are loaded
                    response.data.forEach(namespace => {
                        calls.push(api.getAllKeysInNamespace(namespace));
                    });

                    Promise.all(calls).then(namespaces => {
                        let itemCalls = [];

                        // Fetching metadata for all keys via Promise.all()
                        // to ensure they all are loaded
                        namespaces.forEach((keys, index) => {
                            keys.data.forEach(key => {
                                itemCalls.push(api.getItemMetadata(this.namespaces[index].name, key));
                            });
                        });

                        Promise.all(itemCalls).then(items => {
                            // Pushing keys to namespaces using namespace
                            // metaData key value
                            items.forEach(item => {
                                for(let i = 0; i < this.namespaces.length; ++i) {
                                    if(this.namespaces[i].name === item.data.namespace) {
                                        this.namespaces[i].keys.push({
                                            id: item.data.namespace,
                                            key: item.data.key,
                                            sizeInBytes: item.data.value.length,
                                            created: item.data.created,
                                            lastUpdated: item.data.lastUpdated
                                        });
                                        break;
                                    }
                                }
                            });

                            this.initializing = false;
                        });
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .spinner {
        margin-top: 50px;
    }
</style>