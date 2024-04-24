/** Maps kind, types and subtypes of a PERF element (sequence,block, contentElement)
 * given map object (perfMap) and returns a transformation of that element.
 */
export const mapPerf = ({ props, path, children, kind, defaults, perfMap }) => {
    const { type, subtype } = props;
    const _props = { ...props, kind, path };
    const _defaults = defaults ?? { props: _props, children };
    if (!perfMap)
        return _defaults;
    /** specific overwrite properties of less specific */
    const maps = [
        perfMap["*"],
        perfMap[k(kind)],
        perfMap[t(type)],
        perfMap[s(subtype)],
        perfMap[select(k(kind), t(type))],
        perfMap[select(k(kind), s(subtype))],
        perfMap[select(t(type), s(subtype))],
        perfMap[select(k(kind), t(type), s(subtype))],
    ];
    const nodeHelper = {
        type: "",
        getEmpty(type) {
            const types = {
                array: [],
                object: {},
                string: "",
            };
            return types[type];
        },
        initializeFromNode(node) {
            this.type = Array.isArray(node) ? "array" : typeof node;
            return this.getEmpty(this.type);
        },
        mergeNodes(...nodes) {
            return nodes.reduce((merged, node) => {
                if (this.type === "array") {
                    return [...merged, ...node];
                }
                if (this.type === "object") {
                    return { ...merged, ...node };
                }
                if (this.type === "string") {
                    return merged + node;
                }
            }, this.getEmpty(this.type));
        },
    };
    const onTransformedStack = [];
    const transformedNode = [...maps].reduce((finalNode, map, key, maps) => {
        const mapped = typeof map === "function" ? map(_defaults) : map;
        if (!mapped)
            return finalNode;
        if (finalNode === undefined)
            finalNode = nodeHelper.initializeFromNode(mapped.node);
        const onTransformed = mapped.options?.onTransformed;
        if (typeof onTransformed === "function")
            onTransformedStack.push(onTransformed);
        if (!mapped.options?.merge)
            return nodeHelper.mergeNodes(finalNode, mapped.node);
        maps.splice(0);
        return mapped;
    }, undefined);
    onTransformedStack.forEach((f) => f(transformedNode));
    return transformedNode;
};
const SYMBOLS = {
    kind: "$",
    type: ">",
    subtype: ".",
};
const getSelector = (selectorType, selector) => `${SYMBOLS[selectorType]}${selector}`;
/**
 * Returns a kind selector ($[kind])
 * @param {string} kind
 * @returns {string} $[kind]
 */
const k = (kind) => getSelector("kind", kind);
/**
 * Returns a type selector (>[type])
 * @param {string} type
 * @returns {string} >[type]
 */
const t = (type) => getSelector("type", type);
/**
 * Returns a subtype selector (.[subtype])
 * @param {string} subtype
 * @returns {string} .[subtype]
 */
const s = (subtype) => getSelector("subtype", subtype);
const select = (...args) => args.join("");
