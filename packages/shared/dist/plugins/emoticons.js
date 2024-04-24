import { $createEmoticonNode, EmoticonNode } from "../nodes/EmoticonNode";
function emoticonTransform(node) {
    const textContent = node.getTextContent();
    if (textContent === ":)") {
        node.replace($createEmoticonNode("", "🙂"));
    }
}
export function registerEmoticons(editor) {
    const removeTransform = editor.registerNodeTransform(EmoticonNode, emoticonTransform);
    return () => {
        removeTransform();
    };
}
