import { LexicalEditor } from "lexical";
export declare const registerOnTransform: ({ editor, }: {
    editor: LexicalEditor;
    onTransform: (params: unknown) => void;
}) => () => void;
