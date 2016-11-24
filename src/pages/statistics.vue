<template>
    <div>
        <div v-if="initializing" class="text-center">
            <spinner class="spinner"></spinner>
        </div>
        <div v-else>
            <md-card>
                <md-toolbar>
                    <span class="h3">Statistics</span>
                    <md-button v-on:click="clearCache()" class="mx-0 my-0 md-raised md-warn">clear cache</md-button>
                </md-toolbar>
                <md-card-content>
                    <div class="flex">
                        <div class="col-6">
                            <canvas id="mainChart" class="chart main"></canvas>
                        </div>
                        <div class="col-6">
                                <ul>
                                    <li>
                                        <strong>Largest item: </strong>
                                        <span>
                                            {{ largestItem.key }} ({{ largestItem.namespace }})
                                        </span>
                                    </li>
                                    <li>
                                        <strong>Size: </strong>
                                        <span>{{ largestItem.sizeInBytes | roundBytes }}</span>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        <strong>Last updated item:</strong>
                                        <span>{{ lastUpdated.key }} ({{ lastUpdated.namespace }})</span>
                                    </li>
                                    <li>
                                        <strong>Updated at: </strong>
                                        <span>
                                            {{ lastUpdated.lastUpdated | moment("from") }}
                                            ({{ lastUpdated.lastUpdated | moment("MMM Do") }})
                                        </span>
                                    </li>
                                </ul>
                        </div>
                    </div>
                </md-card-content>
            </md-card>
        </div>
    </div>
</template>

<script type="text/babel">
    import Chart from 'chart.js';
    import spinner from 'components/assets/spinner.vue';
    import api from 'services/api';
    import store from 'store';

    export default {
        data() {
            return {
                initializing: true,
                largestItem: null,
                lastUpdated: null,
                namespaces: [],
                cached_at: null
            }
        },
        created() {
            this.fetch(() => {
                this.calculateNamespacesSizes();
                this.calculateLargestItemSize();
                this.findLastUpdatedKey();
                this.showMainChart();
            });
        },
        components: {
            spinner: spinner
        },
        methods: {
            /**
             * Clear cached data
             * @return {void}
             */
            clearCache() {
                store.remove('cachedDataStoreStatistics');

                this.$events.emit('notification', {
                    type: 'success',
                    message: 'Cache has been cleared successfully'
                })
            },
            /**
             * Calculate largest item size
             * @return {void}
             */
            calculateLargestItemSize() {
                this.namespaces.forEach(namespace => {
                    namespace.keys.forEach(key => {
                        if(this.largestItem === null || this.largestItem.sizeInBytes < key.sizeInBytes) {
                            this.largestItem = key;
                        }
                    });
                });
            },
            /**
             * Find last updated key
             * @return {void}
             */
            findLastUpdatedKey() {
                this.namespaces.forEach(namespace => {
                    namespace.keys.forEach(key => {
                        if(this.lastUpdated === null || this.lastUpdated.lastUpdated < key.lastUpdated) {
                            this.lastUpdated = key;
                        }
                    });
                });
            },
            /**
             * Calculate size in bytes
             * for each namespace based on keys sizes
             * @return {void}
             */
            calculateNamespacesSizes() {
                this.namespaces.forEach((namespace, index) => {
                    this.namespaces[index].sizeInBytes = 0;

                    namespace.keys.forEach(key => {
                        this.namespaces[index].sizeInBytes += key.sizeInBytes;
                    });
                });
            },
            /**
             * Cache all data
             * @return {void}
             */
            cache() {
                store.set('cachedDataStoreStatistics', {
                    cached_at: Date.now(),
                    data: this.namespaces
                });

                this.cached_at = Date.now();
            },
            /**
             * Fetch all data from server
             * @return {undefined}
             */
            fetch(callback) {
                let cached = store.get('cachedDataStoreStatistics');

                if(cached !== undefined && cached !== null) {
                    this.namespaces = cached.data;
                    this.cached_at = cached.cached_at;
                    this.initializing = false;
                    callback();

                    return;
                }

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
                                            namespace: item.data.namespace,
                                            sizeInBytes: item.data.value.length,
                                            created: item.data.created,
                                            lastUpdated: item.data.lastUpdated
                                        });
                                        break;
                                    }
                                }
                            });

                            this.initializing = false;
                            this.cache();
                            callback();
                        });
                    });
                });
            },
            /**
             * Render main charts
             * @return void
             */
            showMainChart() {
                this.$nextTick(() => {
                    new Chart('mainChart', {
                        type: 'doughnut',
                        data: {
                            labels: this.namespaces.map(namespace => namespace.name),
                            datasets: [{
                                label: 'Size in bytes',
                                data: this.namespaces.map(namespace => namespace.sizeInBytes),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 0
                            }]
                        },
                        options: {
                            title: {
                                display: true,
                                text: 'Namespaces size in bytes',
                                fontSize: 14
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            legend: {
                                position: 'bottom'
                            }
                        }
                    });
                });
            }
        }
    }
</script>

<style lang="sass" scoped>
    .md-toolbar {
        .md-button {
            position: absolute;
            right: 15px;
        }
    }

    .spinner {
        margin-top: 50px;
    }

    .chart {
        &.main {
            width: 50%;
        }
    }

    ul {
        padding: 0;

        li {
            list-style-type: none;
            padding: 3px 0;
        }
    }
</style>