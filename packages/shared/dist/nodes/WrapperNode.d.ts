export class WrapperNode extends ElementNode {
    static clone(node: any): WrapperNode;
    static importJSON(serializedNode: any): import("lexical").LexicalNode;
    createDOM(): HTMLSpanElement;
    updateDOM(): boolean;
    exportJSON(): {
        type: string;
        version: number;
        children: import("lexical").SerializedLexicalNode[];
        direction: "ltr" | "rtl" | null;
        format: import("lexical").ElementFormatType;
        indent: number;
    };
}
import { ElementNode } from "lexical";
