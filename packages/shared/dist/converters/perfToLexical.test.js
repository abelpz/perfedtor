"use strict";
// import Epitelete from "epitelete";
// import { transformPerfToLexicalState } from "./perfToLexical";
// import { usfm2perf } from "./usfmToPerf";
// import { fetchUsfm } from "../contentManager/mockup/fetchUsfm";
// describe("Lexical Utils:getSelectedNode", () => {
//   it("should be true (placeholder test - delete me)", async () => {
//     const getLexicalState = (usfmText) => {
//       //Lots of hardcoded data here.
//       const perf = usfm2perf(usfmText, {
//         serverName: "door43",
//         organizationId: "unfoldingWord",
//         languageCode: "en",
//         versionId: "ult",
//       });
//       const bibleHandler = new Epitelete({
//         docSetId: perf.metadata.translation.id,
//         options: { historySize: 100 },
//       });
//       const readOptions = { readPipeline: "stripAlignmentPipeline" };
//       return bibleHandler.sideloadPerf("RUT", perf, { ...readOptions }).then((perf) => {
//         const _lexicalState = transformPerfToLexicalState(perf, perf.main_sequence_id);
//         console.log("Perf to Lexical", { perf, lexicalState: _lexicalState });
//         return JSON.stringify(_lexicalState);
//       });
//     };
//     const lexicalState = await fetchUsfm({
//       serverName: "dbl",
//       organizationId: "bfbs",
//       languageCode: "fra",
//       versionId: "lsg",
//       bookCode: "tit",
//     }).then((usfm) => getLexicalState(usfm));
//     expect(lexicalState).toBe(true);
//   });
//   /* Commented out because `utils.js` needs to be converted to TS.
//   it("should get the node", () => {
//     const selection: RangeSelection | GridSelection | NodeSelection | null = null;
//     const node = getSelectedNode(selection);
//     expect(node).toEqual({});
//   });
//   */
// });
