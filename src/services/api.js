import Vue from 'vue';
import config from 'config';

export default {
    /**
     * Fetch all namespaces in the data store
     * @returns {Promise.<T>}
     */
    getAllNamespaces() {
        return Vue.http.get(`${ config.api_base_url }`).catch(response => {
            throw response;
        });
    },
    /**
     * Fetch all items' keys in the datastore
     * @param namespace
     * @returns {Promise.<T>}
     */
    getAllKeysInNamespace(namespace) {
        return Vue.http.get(`${ config.api_base_url }/${ namespace }`).catch(response => {
            throw response;
        });
    },
    /**
     * Get item's metadata
     * @param namespace
     * @param item
     * @returns {Promise.<T>}
     */
    getItemMetadata(namespace, item) {
        return Vue.http.get(`${ config.api_base_url }/${ namespace }/${ item }/metaData`).catch(response => {
            throw response;
        });
    }
};