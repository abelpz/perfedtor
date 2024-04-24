import { EditorConfig, LexicalNode, NodeKey, SerializedElementNode, Spread } from "lexical";
import { UsfmElementNode } from "./UsfmElementNode";
export type SerializedDivisionMarkNode = Spread<{
    attributes: unknown;
    data: unknown;
}, SerializedElementNode>;
export declare class DivisionMarkNode extends UsfmElementNode {
    static getType(): string;
    static clone(node: DivisionMarkNode): DivisionMarkNode;
    constructor(attributes: unknown, data: unknown, key?: NodeKey);
    static importJSON(serializedNode: SerializedDivisionMarkNode): DivisionMarkNode;
    createDOM(config: EditorConfig): HTMLSpanElement;
    isInline(): boolean;
    exportJSON(): {
        type: string;
        version: number;
        data: any;
        attributes: any;
        tag: any;
        children: import("lexical").SerializedLexicalNode[];
        direction: "ltr" | "rtl" | null;
        format: import("lexical").ElementFormatType;
        indent: number;
    };
    updateDOM(): boolean;
}
export declare function $createDivisionMarkNode(attributes: unknown, data: unknown): DivisionMarkNode;
export declare function $isDivisionMarkNode(node: LexicalNode | null | undefined): node is DivisionMarkNode;
