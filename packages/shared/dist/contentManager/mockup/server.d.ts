interface BookData {
    name?: string;
    file: Promise<unknown>;
}
interface ServerMap {
    [server: string]: {
        [organization: string]: {
            [languageCode: string]: {
                [identifier: string]: {
                    [book: string]: BookData;
                };
            };
        };
    };
}
export declare const serverMap: ServerMap;
export {};
