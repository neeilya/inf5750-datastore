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
    },
    /**
     * Store new item
     * @param namespace
     * @param key
     * @param body
     * @returns {Promise.<T>}
     */
    createItem(namespace, key, body) {
        return Vue.http.post(`${ config.api_base_url }/${ namespace }/${ key }`, body).catch(response => {
            throw response;
        });
    },
    /**
     * Update existing item
     * @param namespace
     * @param key
     * @param body
     * @returns {Promise.<T>}
     */
    updateItem(namespace, key, body) {
        return Vue.http.put(`${ config.api_base_url }/${ namespace }/${ key }`, body).catch(response => {
            throw response;
        });
    },
    /**
     * Delete key from namespace
     * @param namespace
     * @param key
     * @returns {Promise.<T>}
     */
    deleteItem(namespace, key) {
        return Vue.http.delete(`${ config.api_base_url }/${ namespace }/${ key }`).catch(response => {
            throw response;
        });
    },
    /**
     * Delete namespace
     * @param namespace
     * @returns {Promise.<T>}
     */
    deleteNamespace(namespace) {
        return Vue.http.delete(`${ config.api_base_url }/${ namespace }`).catch(response => {
            throw response;
        });
    }
};