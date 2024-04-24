import { $applyNodeReplacement, ElementNode } from "lexical";
export class DivisionNode extends ElementNode {
    constructor(data, key) {
        super(key);
        /** @internal */
        Object.defineProperty(this, "__data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.__data = data;
    }
    static getType() {
        return "division";
    }
    static clone(node) {
        return new DivisionNode(node.__key, node.__data);
    }
    isInline() {
        return true;
    }
    createDOM() {
        // Define the DOM element here
        const dom = document.createElement("span");
        const data = this.__data;
        Object.keys(data).forEach((key) => {
            dom.dataset[key] = data[key];
        });
        dom.className = `${data.type} ${data.subtype}`;
        return dom;
    }
    static importJSON(serializedNode) {
        const { data } = serializedNode;
        console.log({ data });
        const node = $createDivisionNode(data);
        node.setFormat(serializedNode.format);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }
    getData() {
        return this.getLatest().__data;
    }
    exportJSON() {
        return {
            ...super.exportJSON(),
            data: this.getData(),
            type: "division",
            version: 1,
        };
    }
    updateDOM(prevNode, dom) {
        // Returning false tells Lexical that this node does not need its
        // DOM element replacing with a new copy from createDOM.
        return false;
    }
}
function $createDivisionNode(data) {
    return $applyNodeReplacement(new DivisionNode(data));
}
