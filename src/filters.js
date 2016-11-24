import Vue from 'vue';

export default {
    /**
     * Register filters
     */
    register() {
        Vue.filter('roundBytes', (value) => {
            if(value < 1000) {
                return `${ value } bytes`;
            }

            if(value < 1000000) {
                return `~${ Math.round(value / 1000) }kb`;
            }

            if(value < 1000000000) {
                return `~${ Math.round(value / 1000000) }mb`;
            }

            return value;
        });
    }
}