import { LexicalEditor } from "lexical";
export declare const registerOnMutation: ({ editor, }: {
    editor: LexicalEditor;
    onMutation: () => void;
}) => () => void;
