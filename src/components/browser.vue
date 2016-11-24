<template>
    <md-card>
        <md-toolbar>
            <span class="h3">Explorer</span>
        </md-toolbar>
        <md-card-content>
            <md-list class="md-dense" v-for="namespace in namespaces">
                <md-list-item v-on:click="getAllKeysInNamespace(namespace.name)">
                    <md-icon>folder</md-icon> <span>{{ namespace.name }}</span>
                </md-list-item>
                <md-list class="md-dense sublist" v-if="namespace.isClicked" v-for="key in namespace.keys">
                    <md-list-item>
                        <md-icon>insert_drive_file</md-icon> <span>{{ key }}</span>
                    </md-list-item>
                </md-list>
                <!-- <md-list-item>
                    <md-icon>folder</md-icon> <span>METADATASTORE</span>
                </md-list-item>
                <md-list class="md-dense sublist">
                    <md-list-item>
                        <md-icon>insert_drive_file</md-icon> <span>Version_1</span>
                    </md-list-item>
                    <md-list-item>
                        <md-icon>insert_drive_file</md-icon> <span>Version_2</span>
                    </md-list-item>
                    <md-list-item>
                        <md-icon>insert_drive_file</md-icon> <span>Version_3</span>
                    </md-list-item>
                </md-list>

                <md-list-item v-on:click="fireNamespaceClickedEvent('social-media-video')">
                    <md-icon>folder</md-icon> <span>social-media-video</span>
                </md-list-item>
                <md-list class="md-dense sublist">
                    <md-list-item v-on:click="fireItemClickedEvent('hjcF14oVjo4', 'social-media-video')">
                        <md-icon>insert_drive_file</md-icon> <span>hjcF14oVjo4</span>
                    </md-list-item>
                    <md-list-item>
                        <md-icon>insert_drive_file</md-icon> <span>C4C3vNaunZ5</span>
                    </md-list-item>
                    <md-list-item>
                        <md-icon>insert_drive_file</md-icon> <span>KGoevJZx0dq</span>
                    </md-list-item>
                </md-list> -->
            </md-list>

            <md-button v-on:click="fireCreateItemEvent()" class="md-icon-button md-raised md-warn action-button">
                <md-icon class="md-accent">add</md-icon>
                <md-tooltip md-direction="top">Create item/namespace</md-tooltip>
            </md-button>
        </md-card-content>
    </md-card>
</template>

<script>
    import api from 'services/api';

    export default {
        data() {
            return {
                namespaces: [],
            }
        },
        created() {
            //
            this.getAllNamespaces();
        },
        methods: {
            // dummy methods for editor component
            fireNamespaceClickedEvent(namespaceName) {
                this.$events.emit('namespaceClicked', namespaceName);
            },
            fireItemClickedEvent(itemName, namespaceName) {
                this.$events.emit('itemClicked', itemName, namespaceName);
            },
            fireCreateItemEvent() {
                this.$events.emit('createNamespace');
                // check if namespace is chosen and if then fire createItem event otherwise fire createNamespace event
                // this.$events.emit('createItem');
            },
            getAllNamespaces() {
                api.getAllNamespaces().then(response => {
                    response.data.forEach(namespace => {
                        this.namespaces.push({ name: namespace, keys: [], isClicked: false });
                    });                    
                });
            },
            findNamespaceIndex(namespace) {
                for(let i = 0; i < this.namespaces.length; ++i) {
                    if(this.namespaces[i].name === namespace) {
                        return i;
                    }
                }
            },
            getAllKeysInNamespace(namespace) {
                let index = this.findNamespaceIndex(namespace);
                if(this.namespaces[index].isClicked == true) {
                    this.namespaces[index].isClicked = false;
                    return;
                }
                if(this.namespaces[index].keys.length > 0) {
                    this.namespaces[index].isClicked = true;
                    return;
                }
                api.getAllKeysInNamespace(namespace).then(response => {
                    response.data.forEach(key => {
                        this.namespaces[index].keys.push(key);
                    });   
                    this.namespaces[index].isClicked = true;              
                });
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
</style>