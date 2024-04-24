export const transformSequence = ({ children }) => {
    return {
        children: children,
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
    };
};
export const transformText = ({ props: perfElementProps }) => ({
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    text: perfElementProps.text,
    type: "text",
    version: 1,
});
export const transformGraft = (perf) => ({ props: perfElementProps }) => sectionHandler(perfElementProps)({
    children: ((lexicalState) => lexicalState.root.children)(transformPerfToLexicalState(perf, perfElementProps.target)),
    // data: perfElementProps,
    tag: ((subtypeMap) => subtypeMap[perfElementProps.subtype])({
        title: "h1",
        introduction: "section",
        heading: "div",
    }),
    attributes: getAttributesFromPerfElementProps(perfElementProps),
    direction: "ltr",
    format: "",
    indent: 0,
    type: "graft",
    version: 1,
});
export const transformParagraph = ({ props: perfElementProps, children }) => ({
    "*": sectionHandler(perfElementProps)({
        children: children,
        // data: perfElementProps,
        tag: getTagFromSubtype({
            subtype: perfElementProps.subtype,
            replacementMap: {
                "\\w?mt(\\d*)$": "span",
                s: "h3",
                r: "strong",
                f: "span",
            },
        }),
        attributes: getAttributesFromPerfElementProps(perfElementProps),
        direction: "ltr",
        format: "",
        indent: 0,
        type: "usfmparagraph",
        version: 1,
    }),
    x: ({ children, props: perfElementProps }) => ({
        children,
        // data: perfElementProps,
        attributes: getAttributesFromPerfElementProps(perfElementProps),
        direction: "ltr",
        format: "",
        indent: 0,
        type: "inline",
        version: 1,
    }),
});
