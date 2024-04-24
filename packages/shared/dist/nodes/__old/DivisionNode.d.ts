export class DivisionNode extends ElementNode {
    static clone(node: any): DivisionNode;
    static importJSON(serializedNode: any): import("lexical").LexicalNode;
    constructor(data: any, key: any);
    /** @internal */
    __data: any;
    createDOM(): HTMLSpanElement;
    getData(): any;
    exportJSON(): {
        data: any;
        type: string;
        version: number;
        children: import("lexical").SerializedLexicalNode[];
        direction: "ltr" | "rtl" | null;
        format: import("lexical").ElementFormatType;
        indent: number;
    };
    updateDOM(prevNode: any, dom: any): boolean;
}
import { ElementNode } from "lexical";
