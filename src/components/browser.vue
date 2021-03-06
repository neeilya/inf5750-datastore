<template>
    <md-card>
        <md-toolbar>
            <input class="search-input" type="text" v-model="searchKey" placeholder="Search namespace here">
            <div class="toggle-asc">
                <span class="h3">ASC</span> <md-switch v-model="asc" class="md-warn"></md-switch>
            </div>
            
        </md-toolbar>
        <md-card-content class="scrollable">
            <md-list class="md-dense" v-for="namespace in getSortedAndFilteredNamespaces()">
                <md-list-item v-on:click="select(namespace.name); getAllKeysInNamespace(namespace.name)"
                              v-bind:class="{ active: ! current.isKey && current.namespace === namespace.name }">
                    <md-icon>folder</md-icon> <span>{{ namespace.name }}</span>
                </md-list-item>
                <template v-if="namespace.isClicked">
                    <md-list class="md-dense sublist">
                        <md-list-item v-for="key in getSortedKeys(namespace)" 
                                      v-on:click="select(namespace.name, key, true); fireItemClickedEvent(namespace.name, key)"
                                      v-bind:class="{ active: current.isKey && current.key === key && current.namespace === namespace.name }"
                        >
                            <md-icon>insert_drive_file</md-icon> <span>{{ key }}</span>
                        </md-list-item>
                    </md-list>
                </template>
            </md-list>

            <md-button v-on:click="fireCreateItemEvent()" class="md-icon-button md-raised md-warn action-button">
                <md-icon class="md-accent">add</md-icon>
                <md-tooltip md-direction="top">Create item/namespace</md-tooltip>
            </md-button>
        </md-card-content>
    </md-card>
</template>

<script type="text/babel">
    import api from 'services/api';

    export default {
        data() {
            return {
                asc: true,
                searchKey: '',
                namespaces: [],
                current: {}
            }
        },
        created() {
            this.getAllNamespaces();
            this.$events.on('itemCreated', this.handleItemCreatedEvent);
            this.$events.on('itemDeleted', this.handleItemDeletedEvent);
            this.$events.on('namespaceDeleted', this.handleNamespaceDeletedEvent);
        },
        methods: {
            /**
             * fire Item Clicked event
             * @param namespaceName
             * @param itemName
             * @return {void}
             */
            fireItemClickedEvent(namespaceName, itemName) {
                this.$events.emit('itemClicked', namespaceName, itemName);
            },
            /**
             * fire Create Item event
             * @return {void}
             */
            fireCreateItemEvent() {
                this.$events.emit('createItem');
            },
            /**
             * get all namespaces from API
             * @return {Array.<T>}
             */
            getAllNamespaces() {
                api.getAllNamespaces().then(response => {
                    response.data.forEach(namespace => {
                        this.namespaces.push({ name: namespace, keys: [], isClicked: false, isFetched: false});
                    });                    
                });
            },
            /**
             * find index of given namespace in Namespace array
             * @param namespace
             * @returns {*}
             */
            findNamespaceIndex(namespace) {
                for(let i = 0; i < this.namespaces.length; ++i) {
                    if(this.namespaces[i].name === namespace) {
                        return i;
                    }
                }
                return null;
            },
            /**
             * fetch all keys of given namespace from API
             * @param namespace
             * @return {void}
             */
            getAllKeysInNamespace(namespace) {
                this.$events.emit('namespaceClicked', namespace);
                let index = this.findNamespaceIndex(namespace);
                if(this.namespaces[index].isClicked == true) {
                    this.namespaces[index].isClicked = false;
                    return;
                }
                if(this.namespaces[index].keys.length > 0 && this.namespaces[index].isFetched) {
                    this.namespaces[index].isClicked = true;
                    return;
                }
                api.getAllKeysInNamespace(namespace).then(response => {
                    response.data.forEach(key => {
                        this.namespaces[index].keys.push(key);
                    });   
                    this.namespaces[index].isClicked = true;   
                    this.namespaces[index].isFetched = true;            
                });
            },
            /**
             * handle Item Created event
             * @param namespaceName
             * @param itemName
             * @return {void}
             */
            handleItemCreatedEvent(namespaceName, itemName) {
                let index = this.findNamespaceIndex(namespaceName);
                if(index !== null && this.namespaces[index].isFetched === true) {
                    this.namespaces[index].keys.push(itemName);
                } else if(index === null) {
                    this.namespaces.push({ name: namespaceName, keys: [], isClicked: false, isFetched: false });
                }
            },
            /**
             * handle Item Deleted event
             * @param namespaceName
             * @param itemName
             * @return {void}
             */
            handleItemDeletedEvent(namespaceName, itemName) {
                let namespaceIndex = this.findNamespaceIndex(namespaceName);
                if(this.namespaces[namespaceIndex].keys.length === 1) {
                    this.namespaces.splice(namespaceIndex, 1);
                    return;
                }
                let keyIndex = this.namespaces[namespaceIndex].keys.indexOf(itemName);
                if (keyIndex > -1) {
                    this.namespaces[namespaceIndex].keys.splice(keyIndex, 1);
                }
            },
            /**
             * handle Namespace Deleted event
             * @param namespaceName
             * @return {void}
             */
            handleNamespaceDeletedEvent(namespaceName) {
                let namespaceIndex = this.findNamespaceIndex(namespaceName);
                this.namespaces.splice(namespaceIndex, 1);
            },
            /**
             * get sorted array of namespaces, sort by name ASC or DESC
             * @returns {Array.<T>}
             */
            getSortedAndFilteredNamespaces() {
                let sortedAndFilteredNamespaces = this.namespaces.slice().sort((a, b) => {
                    if(this.asc) {
                        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0;
                    }
                    return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : 0;
                });
                if (this.searchKey !== '') {
                    var self = this;
                    return sortedAndFilteredNamespaces.filter((namespace) => {
                        return namespace.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) > -1;
                    });
                }
                return sortedAndFilteredNamespaces;
            },
            /**
             * get sorted array of keys, sort by name ASC or DESC
             * @param namespace
             * @returns {Array.<T>}
             */
            getSortedKeys(namespace) {
                return namespace.keys.slice().sort((a, b) => {
                    if(this.asc) {
                        return a.toLowerCase() > b.toLowerCase() ? 1 : 0;
                    }
                    return a.toLowerCase() < b.toLowerCase() ? 1 : 0;
                });
            },
            select(namespace, key = null, isKey = null) {
                this.current.isKey = false;
                if(isKey === true) {
                    this.current.isKey = true;
                }
                this.current.namespace = namespace;
                this.current.key = key;
                this.$forceUpdate();
            }
        }
    }
</script>

<style scoped>
    .sublist {
        padding: 0 0 0 20px;
    }

    .md-list.md-dense .md-list-item .md-list-item-container {
        font-weight: bold !important;
    }

    .md-list-item-container span {
        font-size: 120%;
    }

    .md-list-item .md-list-item-holder>.md-icon:first-child {
        margin-right: 10px;
    }

    .md-icon {
        color: #7d7d7d;
    }

    .md-list.md-dense {
        padding: 0px;
    }

    .md-list.md-dense.sublist {
        padding: 0 0 0 20px;
    }

    .scrollable {
        max-height: 450px;
        overflow:auto;
    }

    .toggle-asc {
        position: absolute;
        right: 15px;
    }

    .search-input {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, .87);
        font-size: 120%;
        width: calc(100% - 90px);
    }

    .search-input:focus {
        outline: none;
    }

    .md-toolbar .md-icon {
        margin: 0px 2px 0px 5px;
        color: rgba(255, 255, 255, .87);
    }

    .md-list-item.active {
        background-color: #dedede;
    }

</style>