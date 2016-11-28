<template>
    <md-card>
        <div>
            <div v-if="loading" class="overlay">
                <spinner class="spinner"></spinner>
            </div>
            <md-card-content v-if="!loading">
                <fieldset v-bind:disabled="! editMode || saving">
                    <md-input-container v-if="createMode">
                        <label>Namespace</label>
                        <md-select v-model="namespace">
                            <md-option v-for="namespace in namespaces" v-bind:value="namespace">{{ namespace }}</md-option>
                            <md-option value="Other">Other</md-option>
                        </md-select>
                    </md-input-container>

                    <md-input-container v-if="namespace === 'Other'">
                        <label>New namespace</label>
                        <md-input v-model="namespaceOther"></md-input>
                    </md-input-container>

                    <input v-model:value="key" v-bind:disabled="updateMode" placeholder="Key">
                    <textarea v-model="value" placeholder="Value"></textarea>

                    <div v-show="editMode" class="action-button">
                        <md-button v-on:click="deleteItem()" v-if="updateMode" class="md-icon-button md-raised md-danger">
                            <md-icon class="md-accent">delete</md-icon>
                            <md-tooltip md-direction="top">Delete item</md-tooltip>
                        </md-button>
                        <md-button v-on:click="saveItem()" class="md-icon-button md-raised md-violet">
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
                namespaceOther: null,
                value: null,
                key: null,
                saving: false,
                editMode: false,
                mode: null,
                item: {},
                namespaces: []
            }
        },
        created () {
            this.fetchNamespaces();

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
            },
            /**
             * Calculate namespace
             * @return {String}
             */
            finalNamespace() {
                return this.namespaceOther ? this.namespaceOther : this.namespace;
            }
        },
        methods: {
            resetValues() {
                this.namespace = null;
                this.namespaceOther = null;
                this.key = null;
                this.value = null;
            },
            /**
             * Fetch all namespaces
             * @return {void}
             */
            fetchNamespaces() {
                this.loading = true;

                api.getAllNamespaces().then(response => {
                    this.namespaces = response.data;
                    this.loading = false;
                });
            },
            /**
             *  Delete item from server
             *  @return {void}
             */
            deleteItem() {
                this.saving = true;

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
                    this.saving = false;
                });
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
                    return api.createItem(this.finalNamespace, this.key, this.jsonValue);
                }
            },
            /**
             * Fire event dynamically
             * depending on current mode state
             * @return {void}
             */
            fireItemSavedEvent() {
                if(this.mode === 'create') {
                    this.$events.emit('itemCreated', this.finalNamespace, this.key);
                }
            },
            /**
             * Save item in api
             * @return {void}
             */
            saveItem() {
                this.saving = true;

                this.getOperationPromise().then(response => {
                    this.fireItemSavedEvent();

                    this.$events.emit('notification', {
                        type: 'success',
                        message: 'Key has been saved successfully',
                        description: response.message
                    });
                }).catch(error => {
                    this.$events.emit('notification', {
                        type: 'error',
                        message: 'Something went wrong',
                        description: error.body.message
                    });
                }).finally(() => {
                    this.saving = false;
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
             * Handle createItem event
             * @return {void}
             */
            handleCreateItemEvent() {
                this.mode = 'create';
                this.editMode = true;
                this.resetValues();
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