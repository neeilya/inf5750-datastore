<template>
    <md-card>
        <div>
            <div v-if="loading" class="overlay">
                <spinner class="spinner"></spinner>
            </div>
            <md-card-content>
                <fieldset v-bind:disabled="!editMode || loading">
                    <input style="font-size:25px" v-model:value="namespace" v-bind:disabled="updateMode" placeholder="Namespace">
                    <hr>
                    <input v-model:value="key" v-bind:disabled="updateMode || namespaceClicked" placeholder="Key">
                    <textarea v-model="value" placeholder="Value" v-bind:disabled="namespaceClicked"></textarea>

                    <div v-show="editMode" class="action-button">
                        <md-button v-on:click="deleteItem()" v-if="updateMode" class="md-icon-button md-raised md-danger">
                            <md-icon class="md-accent">delete</md-icon>
                            <md-tooltip md-direction="top">Delete item</md-tooltip>
                        </md-button>
                        <md-button v-on:click="saveItem()" v-if="!namespaceClicked" class="md-icon-button md-raised md-violet">
                            <md-icon class="md-accent">done</md-icon>
                            <md-tooltip md-direction="top">Save item</md-tooltip>
                        </md-button>
                    </div>
                </fieldset>
            </md-card-content>
        </div>
    </md-card>
</template>

<script type="text/babel">
    import spinner from 'components/assets/spinner.vue';
    import api from 'services/api';

    export default {
        data() {
            return {
                loading: false,
                namespace: null,
                value: null,
                key: null,
                editMode: false,
                mode: null,
                namespaceClicked: false
            }
        },
        created () {
            this.$events.on('namespaceClicked', this.handleNamespaceClickedEvent);
            this.$events.on('itemClicked', this.handleItemClickedEvent);
            this.$events.on('createItem', this.handleCreateItemEvent);
        },
        components: {
            spinner: spinner
        },
        computed: {
            /**
             * Calculate if current mode is create
             * @return {Boolean}
             */
            createMode() {
                return this.mode === 'create';
            },
            /**
             * Calculate if current mode is update
             * @return {Boolean}
             */
            updateMode() {
                return this.mode === 'update';
            },
            /**
             * Calculate item value for proper json validation on server
             * @return { String | Object }
             */
            jsonValue() {
                try {
                    return JSON.parse(this.value);
                } catch(error) {
                    return `"${ this.value }"`;
                }
            }
        },
        methods: {
            resetValues() {
                this.namespaceClicked ? this.namespaceClicked = false : this.namespace = null;
                this.key = null;
                this.value = null;
            },
            /**
             *  Delete item from server
             *  @return {void}
             */
            deleteItem() {
                this.loading = true;
                if (this.namespaceClicked) {
                    api.deleteNamespace(this.namespace).then(response => {
                        this.$events.emit('namespaceDeleted', this.namespace);

                        this.$events.emit('notification', {
                            type: 'success',
                            message: 'Namespace has been deleted successfully',
                            description: response.message
                        });

                        this.editMode = false;
                        this.resetValues();
                    }).catch(error => {
                        this.$events.emit('notification', {
                            type: 'error',
                            message: 'Something went wrong',
                            description: error.body.message
                        });
                    }).finally(() => {
                        this.loading = false;
                    });
                } else {
                    api.deleteItem(this.namespace, this.key).then(response => {
                        this.$events.emit('itemDeleted', this.namespace, this.key);

                        this.$events.emit('notification', {
                            type: 'success',
                            message: 'Key has been deleted successfully',
                            description: response.message
                        });

                        this.editMode = false;
                        this.resetValues();
                    }).catch(error => {
                        this.$events.emit('notification', {
                            type: 'error',
                            message: 'Something went wrong',
                            description: error.body.message
                        });
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            },
            /**
             * Get promise depending on current mode
             * @returns {*|Promise.<T>}
             */
            getOperationPromise() {
                if(this.mode === 'update') {
                    return api.updateItem(this.namespace, this.key, this.jsonValue);
                }

                if(this.mode === 'create') {
                    return api.createItem(this.namespace, this.key, this.jsonValue);
                }
            },
            /**
             * Fire event dynamically
             * depending on current mode state
             * @return {void}
             */
            fireItemSavedEvent() {
                if(this.mode === 'create') {
                    this.$events.emit('itemCreated', this.namespace, this.key);
                }
            },
            /**
             * Save item in api
             * @return {void}
             */
            saveItem() {
                this.loading = true;

                this.getOperationPromise().then(response => {
                    this.fireItemSavedEvent();

                    this.$events.emit('notification', {
                        type: 'success',
                        message: 'Saved successfully',
                        description: response.message
                    });

                    this.editMode = true;
                    this.mode = 'update';

                }).catch(error => {
                    this.$events.emit('notification', {
                        type: 'error',
                        message: 'Something went wrong',
                        description: error.body.message
                    });
                }).finally(() => {
                    this.loading = false;
                });
            },
            /**
             * Handle itemClicked event
             * @param namespace
             * @param key
             * @return {void}
             */
            handleItemClickedEvent(namespace, key) {
                this.loading = true;
                this.editMode = false;
                this.resetValues();
                this.mode = 'update';

                api.getItem(namespace, key).then(response => {
                    this.key = key;
                    this.value = response.body;
                    this.namespace = namespace;
                    this.editMode = true;
                }).catch(response => {
                    this.$events.emit('notification', {
                        type: 'error',
                        message: 'Something went wrong',
                        description: response.body.message
                    });
                }).finally(() => {
                    this.loading = false;
                });
            },
            /**
             * Handle namespaceClicked event
             * @param namespace
             * @return {void}
             */
            handleNamespaceClickedEvent(namespace) {
                this.editMode = false;
                this.resetValues();
                this.namespaceClicked = true;
                this.namespace = namespace;
                this.mode = 'update';
                this.editMode = true;
                this.updateMode = true;
            },
            /**
             * Handle createItem event
             * @return {void}
             */
            handleCreateItemEvent() {
                this.resetValues();
                this.mode = 'create';
                this.editMode = true;
            }
        }
    }
</script>

<style scoped>
    input {
        width: 100%;
        border: 0;
        font-weight: bold;
        font-size: 120%;
    }

    textarea:focus, input:focus {
        outline: none;
    }

    textarea {
        font-size: 100%;
        margin-top: 10px;
        font-weight: normal;
        border: none;
        min-height: 295px;
        resize: none;
        width: 100%;
    }

    .md-card .md-card-content {
        padding: 25px;
    }

    input::-webkit-input-placeholder {
        font-weight: bold;
    }

    input:-moz-placeholder {
        font-weight: bold;
    }

    input::-moz-placeholder {
        font-weight: bold;
    }

    input:-ms-input-placeholder {  
        font-weight: bold;
    }

    .md-violet, .md-violet:hover {
        background-color: #6639b6;
    }
    .spinner {
        position: relative;
    }
    .overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>