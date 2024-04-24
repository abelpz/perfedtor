export class InlineNode extends UsfmElementNode {
    static clone(node: any): InlineNode;
    static importJSON(serializedNode: any): import("lexical").LexicalNode;
    constructor(attributes: any, data: any, key: any);
    createDOM(config: any): HTMLSpanElement;
    updateDOM(): boolean;
}
import { UsfmElementNode } from "./UsfmElementNode";
