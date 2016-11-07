<template>
    <md-card>
        <md-card-content>
            <input v-model="item.key" placeholder="Key">
            <textarea v-model="item.value" placeholder="Value"/>
            <span v-if="loading"> Loading ... </span>

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
        </md-card-content>
    </md-card>
</template>

<script>
    import config from 'config';

    export default {
        data() {
            return {
                visible: {
                    deleteButton: false,
                    error: false,
                    success: false
                },
                item: {
                    key: null,
                    value: null
                },
                currentNamespace: null,
                loading: false
            }
        },
        created () {
            this.$events.on('itemClicked', this.handleItemClicked);
            this.$events.on('createItem', this.handleCreateItem);
            this.$events.on('createNamespace', this.handleCreateNamespace);
        },
        methods: {
            deleteButton () {
                this.visible.deleteButton = false;
            },
            saveButton () {
                this.visible.deleteButton = true;
            },
            handleCreateItem() {

            },
            handleCreateNamespace() {

            },
            handleItemClicked(itemName, namespaceName) {
                alert('Clicked');
                this.currentNamespace = namespaceName;
                this.item.key = itemName;
                this.loading = true;
                this.$http.get(`${ config.api_base_url }/${namespaceName}/${itemName}`).then(
                    (response) => {
                        this.item.value = response.body;
                    }, (error) => {
                        this.$events.$emit('alert.error', error.body.message);
                    }).finally(() => {
                        this.loading = false;
                    })
                this.visible.deleteButton = true;
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
        background-color: #6639b6 !important;
    }
</style>