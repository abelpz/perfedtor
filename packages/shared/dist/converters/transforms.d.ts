export function transformSequence({ children }: {
    children: any;
}): {
    children: any;
    direction: string;
    format: string;
    indent: number;
    type: string;
    version: number;
};
export function transformText({ props: perfElementProps }: {
    props: any;
}): {
    detail: number;
    format: number;
    mode: string;
    style: string;
    text: any;
    type: string;
    version: number;
};
export function transformGraft(perf: any): ({ props: perfElementProps }: {
    props: any;
}) => any;
export function transformParagraph({ props: perfElementProps, children }: {
    props: any;
    children: any;
}): {
    "*": any;
    x: ({ children, props: perfElementProps }: {
        children: any;
        props: any;
    }) => {
        children: any;
        attributes: any;
        direction: string;
        format: string;
        indent: number;
        type: string;
        version: number;
    };
};
