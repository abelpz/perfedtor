import { convertSequence } from "./perfToX";
import { createPerfMap } from "./utils/maps/sectionsMap";
import { mapPerf } from "./utils/perfMapper";
export const transformPerfToLexicalState = (perf, sequenceId) => ((perfMap) => ({
    root: convertSequence({
        sequence: perf.sequences[sequenceId],
        sequenceId,
        nodeBuilder: (props) => buildLexicalNodeFromPerfNode({
            ...props,
            perfDocument: perf,
            perfMap,
        }),
    }),
}))(createPerfMap);
export default transformPerfToLexicalState;
/**
 * Converts a PERF element to a different format
 */
export const buildLexicalNodeFromPerfNode = ({ props, children, path, kind, perfMap }) => mapPerf({
    props,
    kind,
    path,
    children,
    perfMap,
});
