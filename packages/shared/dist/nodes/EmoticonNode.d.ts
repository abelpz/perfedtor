import { EditorConfig, LexicalNode, NodeKey, TextNode } from "lexical";
export declare class EmoticonNode extends TextNode {
    __className: string;
    static getType(): string;
    static clone(node: EmoticonNode): EmoticonNode;
    constructor(className: string, text: string, key?: NodeKey);
    createDOM(config: EditorConfig): HTMLElement;
}
export declare function $isEmoticonNode(node: LexicalNode | null | undefined): node is EmoticonNode;
export declare function $createEmoticonNode(className: string, emoticonText: string): EmoticonNode;
