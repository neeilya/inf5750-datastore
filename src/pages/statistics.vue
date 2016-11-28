<template>
    <div>
        <div v-if="initializing" class="text-center">
            <spinner class="spinner"></spinner>
        </div>
        <div v-else>
            <md-card>
                <md-toolbar>
                    <span class="h3">Statistics</span>

                    <span class="actions">Last cached {{ cached_at | moment("from") }}</span>
                    <md-button v-on:click="clearCache(); refresh(); fetchAndPrepareStatistics()" class="md-icon-button md-raised refresh-button">
                        <md-icon class="md-accent">refresh</md-icon>
                    </md-button>
                </md-toolbar>
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
    import randomColor from 'random-material-color';

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
            this.fetchAndPrepareStatistics();
        },
        components: {
            spinner: spinner
        },
        methods: {
            /**
             * Generate material colors for each namespace
             * @return {Array}
             */
            generateColorsForNamespaces() {
                let colors = [];

                this.namespaces.forEach(() => {
                    colors.push(this.getUniqueColor(colors));
                });

                return colors;
            },
            /**
             * Recursive function for generating truly random color
             * depending on existing colors in the argument array
             * @param colors
             * @return {String}
             */
            getUniqueColor(colors) {
                let color = randomColor.getColor();

                if(colors.indexOf(color) > -1) {
                    return this.getUniqueColor(colors);
                } else {
                    return color;
                }
            },
            /**
             * Refresh data
             * @return {void}
             */
            refresh() {
                this.namespaces = [];
                this.cached_at = null;
            },
            /**
             * Fetch and prepare statistics
             * @return {void}
             */
            fetchAndPrepareStatistics() {
                this.fetch(() => {
                    this.calculateNamespacesSizes();
                    this.calculateLargestItemSize();
                    this.findLastUpdatedKey();
                    this.showMainChart();
                });
            },
            /**
             * Clear cached data
             * @return {void}
             */
            clearCache() {
                store.remove('cachedDataStoreStatistics');
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
                this.initializing = true;
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
                                backgroundColor: this.generateColorsForNamespaces(),
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
    .md-theme-default .md-toolbar,
    .md-theme-default.md-toolbar {
        padding: 10px 15px;
    }

    .md-toolbar {
        .actions {
            margin: 0;
            margin-left: auto;
        },
        .md-button.refresh-button {
            box-shadow: none;
            margin: 0;
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