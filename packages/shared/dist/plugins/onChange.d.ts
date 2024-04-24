import { EditorState, LexicalEditor } from "lexical";
export declare const registerOnChange: ({ editor, onChange, ignoreHistoryMergeTagChange, ignoreSelectionChange, }: {
    editor: LexicalEditor;
    onChange: (changeProps: {
        editorState: EditorState;
        tags: Set<string>;
        dirtyElements: Map<string, boolean>;
        dirtyLeaves: Set<string>;
    }) => void;
    ignoreHistoryMergeTagChange: boolean;
    ignoreSelectionChange: boolean;
}) => (() => void) | undefined;
