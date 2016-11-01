<template>
    <md-card>
        <md-toolbar>
            <span class="h3">Explorer</span>
        </md-toolbar>
        <md-card-content>
            <md-list class="md-dense">
                <md-list-item>
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

                <md-list-item>
                    <md-icon>folder</md-icon> <span>social-media-video</span>
                </md-list-item>

            </md-list>

            <md-button class="md-icon-button md-raised md-warn action-button">
                <md-icon class="md-accent">add</md-icon>
                <md-tooltip md-direction="top">Create item/namespace</md-tooltip>
            </md-button>
        </md-card-content>
    </md-card>
</template>

<script>
    export default {
        created() {
            //
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

    .md-toolbar {
        padding: 15px;
    }
</style>