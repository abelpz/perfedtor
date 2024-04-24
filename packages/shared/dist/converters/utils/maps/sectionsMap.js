/**
 * builds an object (perfMap) which maps perf elements by their type and subtype
 * this is needed for mapPerf() to assign a transformation
 * to a type/subtype combination.
 */
export const createPerfMap = ((context) => (perf, sequenceId, graftConverter) => {
    const isMainSequence = perf.main_sequence_id === sequenceId;
    if (isMainSequence) {
        context.onHold = [];
        context.sections = { 0: [] };
        context.currentChapter = 0;
    }
    return {
        "*": {
            node: {
                direction: "ltr",
                format: "",
                indent: 0,
                version: 1,
            },
        },
        $block: ({ props }) => ({
            node: {},
            options: {
                onTransformed: (node) => {
                    if (!isMainSequence)
                        return;
                    if (props.type === "graft" && props.subtype === "heading") {
                        context.onHold.push(node);
                        return;
                    }
                    if (props.type === "paragraph") {
                        console.log(props.type, { context }, props);
                        context.sections[context.currentChapter] = [
                            ...context.sections[context.currentChapter],
                            ...context.onHold,
                        ];
                        context.onHold = [];
                    }
                    context.sections[context.currentChapter].push(node);
                },
            },
        }),
        $sequence: ({ children }) => ({
            node: {
                children: children,
                type: "root",
            },
        }),
        ">text": ({ props: perfElementProps }) => ({
            node: {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: perfElementProps.text,
                type: "text",
            },
        }),
        $graft: ({ props: perfElementProps }) => ({
            node: {
                children: graftConverter ? graftConverter(perf, perfElementProps.target) : undefined,
                tag: ((subtypeMap) => subtypeMap[perfElementProps.subtype])({
                    title: "h1",
                    introduction: "section",
                    heading: "div",
                }),
                attributes: getAttributesFromPerfElementProps(perfElementProps),
                type: "graft",
            },
        }),
        ">paragraph": ({ props: perfElementProps, children }) => ({
            node: {
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
                type: "usfmparagraph",
            },
            options: { merge: false },
        }),
        ">paragraph:x": {
            node: {
                type: "inline",
            },
        },
        ">wrapper": ({ children, props: perfElementProps }) => ({
            node: {
                children,
                attributes: getAttributesFromPerfElementProps(perfElementProps),
                type: "inline",
            },
        }),
        ">mark.ts": {
            node: {
                type: "usfmparagraph",
            },
        },
        ...((divisionMark) => ({
            ">mark.verses": divisionMark,
            ">mark.chapter": divisionMark,
        }))(({ props: perfElementProps }) => {
            if (perfElementProps.subtype === "chapter") {
                context.sections[perfElementProps.atts.number] = [];
                context.currentChapter = perfElementProps.atts.number;
            }
            return {
                node: {
                    attributes: {
                        "data-atts-number": perfElementProps.atts.number,
                        "data-type": perfElementProps.type,
                        "data-subtype": perfElementProps.subtype,
                        class: `${perfElementProps.subtype}`,
                    },
                    children: [
                        {
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text: perfElementProps.atts.number,
                            type: "text",
                            version: 1,
                        },
                    ],
                    type: "divisionmark",
                },
            };
        }),
    };
})({});
const getAttributesFromPerfElementProps = (data) => Object.keys(data).reduce((atts, dataKey) => {
    if (["kind", "path", "metaContent"].includes(dataKey))
        return atts;
    atts[`data-${dataKey}`] = data[dataKey];
    return atts;
}, {});
const getTagFromSubtype = ({ subtype, replacementMap }) => replacementMap[subtype] ??
    ((matchedSubtype) => matchedSubtype
        ? subtype.replace(new RegExp(matchedSubtype), replacementMap[matchedSubtype])
        : "p")(Object.keys(replacementMap).find((key) => subtype.match(key)));
