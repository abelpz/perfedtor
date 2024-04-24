export function getLexicalState(usfmText: any): any;
export default BibleStore;
/**
 * A class with useful methods for managing
 * multiple intances of epitelete, each epitelete instance
 * can hold one Bible version (docSet), so this store allows
 * managing multiple Bible versions. Each Bible Version
 * is identified by a docSetId
 */
declare class BibleStore {
    store: Map<any, any>;
    /** creates a new Epitelete instance given a docsetId
     * and params for Epitelete's constructor
     */
    create(epiteleteParams: any): void;
    /** adds an Epitelete instance to the store
     * @param { Epitelete } epiteleteInstance
     */
    add(epiteleteInstance: Epitelete): void;
    /** removes a Epitelete instance from the store
     * @param {string} docSetId
     */
    remove(docSetId: string): void;
    /** gets an Epitelete instance given a docsetId
     * @param {string} docSetId
     */
    get(docSetId: string): void;
}
