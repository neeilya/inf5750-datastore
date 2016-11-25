<template>
    <div id="notifications">
            <div v-for="notification in notifications">
                <md-card v-bind:class="{ error: notification.type === 'error' }">
                    <md-card-header>
                        <div class="button-container">
                            <md-button v-on:click="removeNotification(notification)" class="md-icon-button">
                                <md-icon>close</md-icon>
                            </md-button>
                        </div>
                        <div class="content-container">
                            <div class="md-title">{{ notification.message }}</div>
                            <div class="md-subhead">{{ notification.description }}</div>
                        </div>
                    </md-card-header>
                </md-card>
            </div>
    </div>
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                notifications: [],
                notificationLifeTime: 5000 //ms
            }
        },
        created() {
            this.$events.on('notification', this.pushNotification);
            this.$events.on('notificationRemove', this.removeNotification);
        },
        methods: {
            /**
             * Remove notification from the list
             */
            removeNotification(notification) {
                for(let i = 0; i < this.notifications.length; ++i) {
                    if(this.notifications[i].id === notification.id) {
                        this.notifications.splice(i, 1);
                        break;
                    }
                }
            },
            /**
             * Generate unique id
             * @returns {string}
             */
            generateId() {
                return Math.random().toString(36).slice(2);
            },
            /**
             * Push new notification to the list
             * @param data
             * @return {void}
             */
            pushNotification(data) {
                let notification = {
                    id: this.generateId(),
                    display: true,
                    type: data.type,
                    message: data.message,
                    description: data.description
                };

                this.notifications.unshift(notification);

                // Autoremove this notification later
                setTimeout(() => {
                    this.$events.emit('notificationRemove', notification)
                }, this.notificationLifeTime);
            }
        }
    }
</script>

<style lang="sass" scoped>
    #notifications {
        position: absolute;
        top: 10px;
        width: 15%;
        min-width: 350px;
        right: 0;
        z-index: 2;

        .md-card {
            margin-bottom: 3px;
            background-color: rgba(255,255,255,0.93);

            .button-container {
                float: right;
            }

            .content-container {
                padding-top: 4px;
            }

        &.error { color: #880000; }

            .md-title {
                font-size: 18px;
            }
        }
    }
</style>