export function $createUsfmParagraphNode(attributes: any, data: any, tag: any): import("lexical").LexicalNode;
export function $isUsfmParagraphNode(node: any): boolean;
export class UsfmParagraphNode extends UsfmElementNode {
    static clone(node: any): UsfmParagraphNode;
    static importJSON(serializedNode: any): import("lexical").LexicalNode;
    createDOM(config: any): any;
    updateDOM(): boolean;
}
import { UsfmElementNode } from "./UsfmElementNode";
