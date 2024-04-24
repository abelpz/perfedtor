/**
 * Takes a DATA and creates a SectionMarkNode.
 * @param data - The DATA the SectionMarkNode should direct to.
 * @param attributes - Optional HTML a tag attributes { target, rel, title }
 * @returns The SectionMarkNode.
 */
export function $createSectionMarkNode(data: any): import("lexical").LexicalNode;
/**
 * Determines if node is a SectionMarkNode.
 * @param node - The node to be checked.
 * @returns true if node is a SectionMarkNode, false otherwise.
 */
export function $isSectionMarkNode(node: any): boolean;
/**
 * Takes a DATA and creates an AutoSectionMarkNode. AutoSectionMarkNodes are generally automatically generated
 * during typing, which is especially useful when a button to generate a SectionMarkNode is not practical.
 * @param {Object} data - The DATA the SectionMarkNode should contain coming from PERF.
 * @param {string} data.type - the type of element "mark"
 * @param {string} data.subtype - the subtype "chapter or verse"
 * @param {Object} data.atts
 * @param {Object} data.atts.number - the verse or chapter number
 * @returns The SectionMarkNode.
 */
export function $createAutoSectionMarkNode(data: {
    type: string;
    subtype: string;
    atts: {
        number: Object;
    };
}): import("lexical").LexicalNode;
/**
 * Determines if node is an AutoSectionMarkNode.
 * @param node - The node to be checked.
 * @returns true if node is an AutoSectionMarkNode, false otherwise.
 */
export function $isAutoSectionMarkNode(node: any): boolean;
/**
 * Generates or updates a SectionMarkNode. It can also delete a SectionMarkNode if the DATA is null,
 * but saves any children and brings them up to the parent node.
 * @param data - The DATA the sectionmark directs to.
 * @param attributes - Optional HTML a tag attributes. { target, rel, title }
 */
export function toggleSectionMark(data: any): void;
/** @noInheritDoc */
export class SectionMarkNode extends ElementNode {
    static clone(node: any): SectionMarkNode;
    static importDOM(): {
        a: (node: any) => {
            conversion: {
                node: import("lexical").LexicalNode | null;
            };
            priority: number;
        };
    };
    static importJSON(serializedNode: any): import("lexical").LexicalNode;
    constructor(data: any, key: any);
    __data: any;
    createDOM(config: any): HTMLAnchorElement;
    updateDOM(prevNode: any, anchor: any, config: any): boolean;
    sanitizeData(data: any): any;
    exportJSON(): {
        data: any;
        type: string;
        version: number;
        children: import("lexical").SerializedLexicalNode[];
        direction: "ltr" | "rtl" | null;
        format: import("lexical").ElementFormatType;
        indent: number;
    };
    getData(): any;
    setData(data: any): void;
    insertNewAfter(selection: any, restoreSelection?: boolean): import("lexical").LexicalNode | null;
    extractWithChild(child: any, selection: any, destination: any): boolean;
}
export class AutoSectionMarkNode extends SectionMarkNode {
    static importDOM(): null;
}
export const TOGGLE_SECTIONMARK_COMMAND: import("lexical").LexicalCommand<any>;
import { ElementNode } from "lexical";
