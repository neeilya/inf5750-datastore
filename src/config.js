export default {
    /**
     * Base url
     * @type {String}
     */
    base_url: '/',
    /**
     * Base API URL
     * @type {String}
     */
    api_base_url: '/api/25/dataStore',
    /**
     * Constructor
     * @return {Object}
     */
    init() {
        this.api_base_url = this.base_url + this.api_base_url;

        delete(this.init);

        return this;
    }
}.init();
