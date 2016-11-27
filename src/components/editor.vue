<template>
    <md-card>
        <div>
            <md-card-content>
                <fieldset v-bind:disabled="! editMode || saving">
                    <input v-model="item.key" placeholder="Key">
                    <textarea v-model="item.value" placeholder="Value"></textarea>

                    <div v-show="editMode" class="action-button">
                        <md-button v-on:click="deleteItem()" class="md-icon-button md-raised md-danger">
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
                saving: false,
                editMode: false,
                mode: null,
                itemOld: {},
                item: {},
                namespaces: []
            }
        },
        created () {
            this.$events.on('itemClicked', this.handleItemClickedEvent);
            this.$events.on('createItem', this.handleCreateItemEvent);
        },
        components: {
            spinner: spinner
        },
        computed: {
            /**
             * Calculate item value for proper json validation on server
             * @return { String | Object }
             */
            value() {
                try {
                    return JSON.parse(this.item.value);
                } catch(error) {
                    return `"${ this.item.value }"`;
                }
            }
        },
        methods: {
            deleteItem() {
                this.saving = true;

                api.deleteItem(this.item.namespace, this.item.key).then(response => {
                    this.$events.emit('notification', {
                        type: 'success',
                        message: 'Key has been deleted successfully',
                        description: response.body.message
                    });

                    this.editMode = false;
                    this.item = {};
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
                    return api.updateItem(this.item.namespace, this.item.key, this.value);
                }

                if(this.mode === 'create') {
                    return api.createItem(this.item.namespace, this.item.key, this.value);
                }
            },
            /**
             * Fire event dynamically
             * depending on current mode state
             * @return {void}
             */
            fireItemSavedEvent() {
                if(this.mode === 'update') {
                    this.$events.emit('itemUpdated', this.item.namespace, this.item.key, this.itemOld.key);
                }

                if(this.mode === 'create') {
                    this.$events.emit('itemCreated', this.item.namespace, this.item.key);
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
                        description: response.body.message
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
                this.mode = 'update';

                // to distinguish old and new values
                this.itemOld.key = key;
                this.itemOld.namespace = namespace;

                api.getItem(namespace, key).then(response => {
                    this.item.key = key;
                    this.item.value = response.body;
                    this.item.namespace = namespace;
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
            handleCreateItemEvent() {
                this.mode = 'create';
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
        margin-top: 50px;
    }
</style>