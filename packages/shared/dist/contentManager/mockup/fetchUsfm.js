import { serverMap } from "./server";
/** a mockup function for fetching usfm */
export function fetchUsfm({ serverName = "unknown", organizationId = "unknown", languageCode = "unknown", versionId = "unknown", bookCode = "unknown", }) {
    return serverMap[serverName][organizationId][languageCode][versionId][bookCode]
        .file;
}
