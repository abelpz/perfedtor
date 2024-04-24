export class GraftNode extends UsfmElementNode {
    static clone(node: any): GraftNode;
    static importJSON(serializedNode: any): import("lexical").LexicalNode;
    createDOM(config: any): any;
    updateDOM(): boolean;
}
import { UsfmElementNode } from "./UsfmElementNode";
