/** a mockup function for fetching usfm */
export declare function fetchUsfm({ serverName, organizationId, languageCode, versionId, bookCode, }: {
    serverName?: string | undefined;
    organizationId?: string | undefined;
    languageCode?: string | undefined;
    versionId?: string | undefined;
    bookCode?: string | undefined;
}): Promise<string>;
