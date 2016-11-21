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
    import config from 'config';

    export default {
        data() {
            return {
                initializing: true,
                namespaces: []
            }
        },
        created() {
            this.fetchNamespaces().then( response => {
                for(let i = 0; i < response.data.length; ++i) {
                    let namespace = response.data[i];
                    let lastNamespace = i === response.data.length - 1;

                    this.namespaces.push({
                        name: namespace,
                        keys: []
                    });

                    this.fetchItemsForNamespace(namespace).then(response => {
                        for(let j = 0; j < response.data.length; ++j) {
                            let item = response.data[j];
                            let lastItem = j === response.data.length - 1;

                            this.fetchItem(namespace, item).then(response => {
                                this.namespaces[i].keys.push({
                                    lastUpdated: response.data.lastUpdated,
                                    id: response.data.id
                                });

                                if(lastNamespace && lastItem) {
                                    this.initializing = false;
                                }
                            });
                        }
                    });
                }
            });
        },
        components: {
            spinner: spinner
        },
        methods: {
            fetchNamespaces() {
                return this.$http.get(`${ config.api_base_url }`);
            },
            fetchItemsForNamespace(namespace) {
                return this.$http.get(`${ config.api_base_url }/${ namespace }`);
            },
            fetchItem(namespace, item) {
                return this.$http.get(`${ config.api_base_url }/${ namespace }/${ item }/metaData`);
            }
        }
    }
</script>

<style scoped>
    .spinner {
        margin-top: 50px;
    }
</style>