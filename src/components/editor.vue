<template>
    <md-card>
        <div v-if="loading" class="text-center">
            <spinner class="spinner"></spinner>
        </div>
        <div v-show="!loading">
            <md-card-content>
                <fieldset v-bind:disabled="disabled">
                    <input v-model="item.key" placeholder="Key">
                    <textarea v-model="item.value" placeholder="Value"></textarea>

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
                currentNamespace: null,
                loading: false,
                disabled: true,
                active: ''
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
             * Delete current selected item
             */
            deleteButton () {
                switch(this.active) {
                    case 'namespaceClicked':
                        break;
                    case 'itemClicked':
                        api.deleteItem(this.currentNamespace, this.item.key).then(response => {
                            this.notification('success', 'Item have been deleted', response.body.message);
                            // Fire itemDeleted(itemName, namespaceName) event
                            this.$events.emit('itemDeleted', this.item.key, this.currentNamespace);
                            this.clear();
                        }).catch(error => {
                            this.notification('error', 'Something went wrong', error.body.message);
                        }).finally(() => {
                            this.loading = false;
                        });
                        break;
                    default:
                        this.notification('error', 'No active event', 'You have to select either namespace or key');
                }
            },
            /* Update the data in the datastore
             */
            saveButton () {
                switch(this.active) {
                    case 'namespaceClicked':
                        // update nameSpace
                        break;
                    case 'itemClicked':
                        this.loading = true;
                        api.updateItem(this.currentNamespace, this.item.key, this.item.value).then(response => {
                            this.notification('success', 'Value have been updated', response.body.message);
                        }).catch(error => {
                            this.notification('error', 'Something went wrong', error.body.message);
                        }).finally(() => {
                            this.loading = false;
                        });
                        break;
                    default:
                        this.notification('error', 'No active events', 'Some message');
                }
            },
            handleCreateItem() {

            },
            handleCreateNamespace() {
                
            },
            /* Fill the namespace into the item key field, set active event to 'namespaceClicked'
             * @param namespaceName
             */
            handleNamespaceClicked(namespaceName) {
                this.clear();
                this.active = 'namespaceClicked';
                this.disabled = false;
                this.currentNamespace = namespaceName;
                this.item.key = namespaceName;
            },
            /* Fetch the value of the item clicked, set active event to 'itemClicked'
             * @param itemNAme
             * @param namespaceName
             */
            handleItemClicked(itemName, namespaceName) {
                this.loading = true;
                api.getItem(namespaceName, itemName).then(response => {
                    this.clear();
                    this.active = 'itemClicked';
                    this.currentNamespace = namespaceName;
                    this.item.key = itemName;
                    this.item.value = response.body;
                    this.disabled = false;
                    this.visible.deleteButton = true;
                }).catch(error => {
                    this.$events.emit('notification', { type: 'error', message: 'error.body.message' });
                    this.clear();
                }).finally(() => {
                    this.loading = false;
                });
            },
            clear() {
                this.item.key = null;
                this.item.value = null;
                this.disabled = true;
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