export function createPerfMap(perf: any, sequenceId: any, graftConverter: any): {
    ">mark.verses": ({ props: perfElementProps }: {
        props: any;
    }) => {
        node: {
            attributes: {
                "data-atts-number": any;
                "data-type": any;
                "data-subtype": any;
                class: string;
            };
            children: {
                detail: number;
                format: number;
                mode: string;
                style: string;
                text: any;
                type: string;
                version: number;
            }[];
            type: string;
        };
    };
    ">mark.chapter": ({ props: perfElementProps }: {
        props: any;
    }) => {
        node: {
            attributes: {
                "data-atts-number": any;
                "data-type": any;
                "data-subtype": any;
                class: string;
            };
            children: {
                detail: number;
                format: number;
                mode: string;
                style: string;
                text: any;
                type: string;
                version: number;
            }[];
            type: string;
        };
    };
    "*": {
        node: {
            direction: string;
            format: string;
            indent: number;
            version: number;
        };
    };
    $block: ({ props }: {
        props: any;
    }) => {
        node: {};
        options: {
            onTransformed: (node: any) => void;
        };
    };
    $sequence: ({ children }: {
        children: any;
    }) => {
        node: {
            children: any;
            type: string;
        };
    };
    ">text": ({ props: perfElementProps }: {
        props: any;
    }) => {
        node: {
            detail: number;
            format: number;
            mode: string;
            style: string;
            text: any;
            type: string;
        };
    };
    $graft: ({ props: perfElementProps }: {
        props: any;
    }) => {
        node: {
            children: any;
            tag: any;
            attributes: {};
            type: string;
        };
    };
    ">paragraph": ({ props: perfElementProps, children }: {
        props: any;
        children: any;
    }) => {
        node: {
            children: any;
            tag: any;
            attributes: {};
            type: string;
        };
        options: {
            merge: boolean;
        };
    };
    ">paragraph:x": {
        node: {
            type: string;
        };
    };
    ">wrapper": ({ children, props: perfElementProps }: {
        children: any;
        props: any;
    }) => {
        node: {
            children: any;
            attributes: {};
            type: string;
        };
    };
    ">mark.ts": {
        node: {
            type: string;
        };
    };
};
