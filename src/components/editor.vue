<template>
    <md-card>
        <div v-if="loading" class="text-center">
            <spinner class="spinner"></spinner>
        </div>
        <div v-show="!loading">
            <md-card-content>
                <fieldset v-bind:disabled="disabled.card">
                    <input v-model="item.key" placeholder="Key">
                    <textarea v-model="item.value" placeholder="Value" v-bind:disabled="disabled.value"></textarea>

                    <div class="action-button">
                        <md-button v-on:click="deleteButton()" v-if="visible.deleteButton" class="md-icon-button md-raised md-danger">
                            <md-icon class="md-accent">delete</md-icon>
                            <md-tooltip md-direction="top">delete item/namespace</md-tooltip>
                        </md-button>
                        <md-button v-on:click="saveButton()" class="md-icon-button md-raised md-violet">
                            <md-icon class="md-accent">done</md-icon>
                            <md-tooltip md-direction="top">save item/namespace</md-tooltip>
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
                visible: {
                    deleteButton: false,
                },
                item: {
                    key: null,
                    value: null
                },
                current: {
                    event: '',
                    namespace: '',
                    key: '',
                    value: ''
                },
                disabled: {
                    card: true,
                    value: true
                },
                loading: false,
            }
        },
        created () {
            this.$events.on('namespaceClicked', this.handleNamespaceClicked);
            this.$events.on('itemClicked', this.handleItemClicked);
            this.$events.on('createItem', this.handleCreateItem);
            this.$events.on('createNamespace', this.handleCreateNamespace);
        },
        components: {
            spinner: spinner
        },
        methods: {
            /**
             * Fire notification event
             * @param type
             * @param title
             * @param message
             */
            notification (type, title, message) {
                this.$events.emit('notification', { type: type, title: title, message: message });
            },
            /**
             * Updates current event and keeps old values
             * @param event
             * @param namespace
             * @param key
             * @param value
            */
            updateCurrentValues (event, namespace, key, value) {
                this.current.event = event;
                this.current.namespace = namespace;
                this.current.key = key;
                this.current.value = value;
            },
            /**
             * Disable/undisable card or value field
             * @param card
             * @param value
             */
             updateDisabled(card, value) {
                this.disabled.card = card;
                this.diabled.value = value;
             },
            /**
             * Delete current selected
             */
            deleteButton () {
                switch(this.current.event) {
                    case 'namespaceClicked':
                        api.deleteNamespace(this.current.namespace).then(response => {
                            this.notification('success', 'Namespace have been deleted', response.body.message);
                            // Fire event namespceDeleted(namespaceName)
                            this.$events.emit('namespaceDeleted', this.current.namespace);
                            this.clear();
                        }).catch(error => {
                            this.notification('error', 'Something went wrong', error.body.message);
                        }).finally(() => {
                            this.loading = false;
                        });
                        break;
                    case 'itemClicked':
                        api.deleteItem(this.current.namespace, this.item.key).then(response => {
                            this.notification('success', 'Item have been deleted', response.body.message);
                            // Fire event itemDeleted(itemName, namespaceName)
                            this.$events.emit('itemDeleted', this.item.key, this.current.namespace);
                            this.clear();
                        }).catch(error => {
                            this.notification('error', 'Something went wrong', error.body.message);
                        }).finally(() => {
                            this.loading = false;
                        });
                        break;
                    default:
                        this.notification('error', 'No active event', 'Namespace or key must be selected');
                }
            },
            /**
             * Update the data in the datastore, or save new namespace/key to the datastore
             */
            saveButton () {
                switch(this.current.event) {
                    case 'itemClicked':
                        this.loading = true;
                        api.updateItem(this.current.namespace, this.item.key, this.item.value).then(response => {
                            this.notification('success', 'Value have been updated', response.body.message);
                            // Fire event itemUpdated(itemName, oldName, namespaceName)
                            this.$events.emit('itemDeleted', this.item.key, this.current.namespace);
                        }).catch(error => {
                            this.notification('error', 'Something went wrong', error.body.message);
                        }).finally(() => {
                            this.loading = false;
                        });
                        break;
                    case 'createItem':
                        this.loading = true;
                        api.createItem(this.current.namespace, this.item.key, this.item.value).then(response => {
                            this.notification('success', 'Created item', response.body.message);
                            // Fire event itemCreated(item, namespaceName)
                            this.$events.emit('itemCreated', this.item.key, this.current.namespace);
                            // Update active event, and current values
                            this.updateCurrentValues('itemClicked', this.current.namespace, this.item.key, this.item.value);
                        }).catch(error => {
                            this.notification('error', 'Something went wrong', error.body.message);
                        }).finally(() => {
                            this.loading = false;
                        });
                        break;
                    case 'createNamespace':
                        this.loading = true;
                        api.createNamespace(this.item.key).then(response => {
                            this.notification('success', 'Created namespace', response.body.message);
                            // Fire event namespaceCreated(namespaceName)
                            this.$events.emit('namespaceCreated', this.item.key, this.current.namespace);
                            // Update active event, and current values
                            this.updateCurrentValues('namespaceClicked', this.item.key, '','');
                        }).catch(error => {
                            this.notification('error', 'Something went wrong', error.body.message);
                        }).finally(() => {
                            this.loading = false;
                        });
                        break;
                    default:
                        this.notification('error', 'No selected event', 'There are no selected event');
                }
            },
            /**
             * Clears fields, and sets active event to 'createItem'
             */
            handleCreateItem(namespace) {
                this.clear();
                this.updateCurrentValues('createItem', 'namespace', '', '');
                this.updateDisabled(false, false);
            },
            /**
             * Clears fields, and sets active event to 'createNamespace'
             */
            handleCreateNamespace() {
                this.clear();
                this.updateCurrentValues('createNamespace', '', '', '');
                this.updateDisabled(false, true);
            },
            /**
             * Fill namespace into the item key field, set active event to 'namespaceClicked'
             * @param namespaceName
             */
            handleNamespaceClicked(namespaceName) {
                this.clear();
                this.updateDisabled(false, true);
                this.updateCurrentValues('namespaceClicked', namespaceName, '', '');
                this.item.key = namespaceName;
                this.visible.deleteButton = true;
            },
            /**
             * Fetch the value of the item clicked, set active event to 'itemClicked'
             * @param itemNAme
             * @param namespaceName
             */
            handleItemClicked(itemName, namespaceName) {
                this.loading = true;
                this.clear();
                api.getItem(namespaceName, itemName).then(response => {
                    // Update current values
                    this.updateCurrentValues('itemClicked', namespaceName, itemName, response.body)
                    // Update fields
                    this.item.key = itemName;
                    this.item.value = response.body;
                    this.updateDisabled(false, false);
                    // Show delete button
                    this.visible.deleteButton = true;
                }).catch(error => {
                    this.$events.emit('notification', { type: 'error', message: 'error.body.message' });
                }).finally(() => {
                    this.loading = false;
                });
            },
            /**
             * Clears all fields and disables the editor component
             */
            clear() {
                // Empty fields
                this.item.key = null;
                this.item.value = null;
                // Disable the editor
                this. updateDisabled(true, false);
                // Hide delete button
                this.visible.deleteButton = false
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