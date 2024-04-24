export function convertPerf({ perfDocument, nodeBuilder }: {
    perfDocument: any;
    nodeBuilder: any;
}): any;
export function convertSequence({ sequence, sequenceId, nodeBuilder: buildNode }: {
    sequence: any;
    sequenceId: any;
    nodeBuilder: any;
}): any;
export function convertBlock({ block, nodeBuilder: buildNode, path }: {
    block: any;
    nodeBuilder: any;
    path: any;
}): any;
export function getContents({ content, nodeBuilder: buildNode, path }: {
    content: any;
    nodeBuilder: any;
    path: any;
}): any;
export function convertContentElement({ element, nodeBuilder: buildNode, path }: {
    element: any;
    nodeBuilder: any;
    path: any;
}): any;
export default convertPerf;
