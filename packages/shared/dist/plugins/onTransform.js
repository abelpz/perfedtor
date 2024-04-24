import ScriptureNodes from "../nodes";
import { TextNode } from "lexical";
export const registerOnTransform = ({ editor, // onTransform,
 }) => {
    // console.log("TRANSFORMED");
    const callback = (node) => {
        return node;
    };
    const unregisterTransformArray = [TextNode, ...ScriptureNodes].map((Node) => editor.registerNodeTransform(Node, callback));
    return () => unregisterTransformArray.forEach((f) => f());
};
