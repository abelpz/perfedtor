export class UsfmElementNode extends ElementNode {
    constructor(attributes: any, data: any, tag: any, key: any);
    __data: any;
    __attributes: any;
    __tag: any;
    getData(): any;
    setData(data: any): void;
    getAttributes(): any;
    setAttributes(attributes: any): void;
    getTag(): any;
    setTag(tag: any): void;
    exportJSON(): {
        data: any;
        attributes: any;
        tag: any;
        type: string;
        version: number;
        children: import("lexical").SerializedLexicalNode[];
        direction: "ltr" | "rtl" | null;
        format: import("lexical").ElementFormatType;
        indent: number;
    };
}
import { ElementNode } from "lexical";
