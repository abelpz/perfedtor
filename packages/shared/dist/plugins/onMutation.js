import { InlineNode } from "../nodes/InlineNode";
export const registerOnMutation = ({ editor, // onMutation,
 }) => {
    // console.log("MUTATED");
    return editor.registerMutationListener(InlineNode, (mutatedNodes) => {
        // console.log({ mutatedNodes });
        // mutatedNodes is a Map where each key is the NodeKey, and the value is the state of mutation.
        for (const [nodeKey, mutation] of mutatedNodes) {
            return { nodeKey, mutation };
            // console.log({ nodeKey, mutation });
        }
    });
};
