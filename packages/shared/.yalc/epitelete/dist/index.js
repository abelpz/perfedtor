"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _proskommaJsonTools = require("proskomma-json-tools");
var _pipelines2 = _interopRequireDefault(require("./pipelines"));
var _transforms = _interopRequireDefault(require("./transforms"));
var _perf = _interopRequireDefault(require("@findr/perf"));
var _default2 = _interopRequireDefault(require("rfdc/default"));
var _utils = require("./utils");
var _excluded = ["proskomma", "docSetId", "options"],
  _excluded2 = ["hs"],
  _excluded3 = ["perf"],
  _excluded4 = ["writePipeline", "cloning", "insertSequences"],
  _excluded5 = ["sequences"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var ACTIONS = {
  WRITE_PERF: 'writePerf',
  READ_PERF: 'readPerf',
  LOAD_PERF: 'loadPerf',
  UNDO_PERF: 'undoPerf',
  REDO_PERF: 'redoPerf'
};
/**
 * PERF Middleware for Editors in the Proskomma Ecosystem
 * @class
 */
class Epitelete {
  /**
   * @param {Object} args - constructor args
   * @param {Proskomma} [args.proskomma] - a proskomma instance
   * @param {number} args.docSetId - a docSetId
   * @param {object} [args.options={}] - setting params
   * @param {number} [args.options.historySize=10] - size of history buffer
   * @param {object} [args.options.pipelines] - custom pipelines to add to epitelete's internal pipeline handler.
   * @param {object} [args.options.transforms] - custom transform actions to add to epitelete's internal pipeline handler.
   * @return {Epitelete} Epitelete instance
   */
  constructor(_ref) {
    var {
        proskomma = null,
        docSetId,
        options = {}
      } = _ref,
      args = _objectWithoutProperties(_ref, _excluded);
    (0, _utils.validateParams)(["proskomma", "docSetId", "options"], args, "Unexpected arg in constructor");
    (0, _utils.validateParams)(["historySize", "pipelines", "transforms"], options, "Unexpected option in constructor");
    if (!docSetId) {
      throw new Error("docSetId is required");
    }
    this._observers = [];
    var query = "{ docSet(id: \"".concat(docSetId, "\") { id } }");
    var {
      data: gqlResult
    } = (proskomma === null || proskomma === void 0 ? void 0 : proskomma.gqlQuerySync(query)) || {};
    if (proskomma && !(gqlResult !== null && gqlResult !== void 0 && gqlResult.docSet)) {
      throw new Error("Provided docSetId is not present in the Proskomma instance.");
    }
    var {
        hs
      } = options,
      opt = _objectWithoutProperties(options, _excluded2);
    var historySize = hs ? hs + 1 : 11; //add one to passed history size so it matches undos allowed.

    this.options = _objectSpread({
      historySize
    }, opt);
    this.proskomma = proskomma;
    this.pipelineHandler = new _proskommaJsonTools.PipelineHandler({
      pipelines: _pipelines2.default || options.pipelines ? _objectSpread(_objectSpread(_objectSpread({}, _pipelines2.default), options.pipelines), _perf.default.pipelines) : null,
      transforms: _transforms.default || options.transforms ? _objectSpread(_objectSpread(_objectSpread({}, _transforms.default), options.transforms), _perf.default.transforms) : null,
      proskomma: proskomma
    });
    this.docSetId = docSetId;

    /** @type saved: the latest perf saved*/
    this.saved = {};
    /** @type history */
    this.history = {};
    this.validator = new _proskommaJsonTools.Validator();
    this.backend = proskomma ? 'proskomma' : 'standalone';
  }
  unobserve(observer) {
    this._observers = this._observers.filter(o => o !== observer);
  }
  observe(observer) {
    this._observers.push(observer);
    return () => this.unobserve(observer);
  }
  notifyObservers() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this._observers.forEach(observer => {
      observer(...args);
    });
  }

  /**
   * Adds a new PipelineHandler instance to current Epitelete pipelineHandler prop.
   * @param {Object} args - method args
   * @param {Object} [args.pipelines] - custom pipelines to add to epitelete's internal pipeline handler.
   * @param {Object} [args.transforms] - custom transform actions to add to epitelete's internal pipeline handler.
   * @private
  */
  instanciatePipelineHandler(_ref2) {
    var {
      pipelines: _pipelines,
      transforms
    } = _ref2;
    new _proskommaJsonTools.PipelineHandler({
      pipelines: _pipelines2.default || _pipelines ? _objectSpread(_objectSpread({}, _pipelines2.default), _pipelines) : null,
      transforms: _transforms.default || transforms ? _objectSpread(_objectSpread({}, _transforms.default), transforms) : null
    });
  }

  /**
   * Gets book data from history in current cursor position.
   * @param {string} bookCode
   * @private
  */
  getBookData(bookCode) {
    var history = this.history[bookCode];
    return history === null || history === void 0 ? void 0 : history.stack[history.cursor];
  }

  /**
   * Gets a copy of a document from history
   * @private
   * @param {string} bookCode
   * @param {boolean} [clone=true] true if document should be cloned
   * @return {perfDocument} matching PERF document
   */
  getDocument(bookCode) {
    var clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var bookData = this.getBookData(bookCode);
    var perfDocument = bookData === null || bookData === void 0 ? void 0 : bookData.perfDocument;
    if (!perfDocument) return;
    return clone ? (0, _default2.default)(perfDocument) : _objectSpread({}, perfDocument);
  }

  /**
   * Gets documents copies from history
   * @private
   * @return {Object<bookCode,perfDocument>} Object with book code as key and PERF document as value
   */
  getDocuments() {
    return Object.keys(this.history).reduce((documents, bookCode) => {
      documents[bookCode] = this.getDocument(bookCode);
      return documents;
    }, {});
  }

  /**
   * Stores the reference to the current perfDocument in history.
   * @param {string} bookCode 
   */
  savePerf(bookCode) {
    this.saved[bookCode] = this.getBookData(bookCode);
  }

  /**
   * Checks if the current perfDocument in history matches the stored one.
   * @param {string} bookCode 
   * @returns 
   */
  canSavePerf(bookCode) {
    return this.saved[bookCode] !== this.getBookData(bookCode);
  }
  setBookHistory(bookCode) {
    var _this$history, _this$history$bookCod;
    (_this$history$bookCod = (_this$history = this.history)[bookCode]) !== null && _this$history$bookCod !== void 0 ? _this$history$bookCod : _this$history[bookCode] = {
      stack: [],
      cursor: 0
    };
    return this.history[bookCode];
  }
  getBookHistory(bookCode) {
    var _this$history$bookCod2;
    var history = (_this$history$bookCod2 = this.history[bookCode]) !== null && _this$history$bookCod2 !== void 0 ? _this$history$bookCod2 : this.setBookHistory(bookCode);
    return history;
  }

  /**
   * Clears docs history
   * @return {void} void
   */
  clearPerf() {
    this.history = {};
  }

  /**
   * Adds new document to history (replaces any doc with same bookCode already in history)
   * @param {string} bookCode
   * @param {perfDocument} doc
   * @param {boolean} [clone=true] true if document should be cloned
   * @return {perfDocument} same passed PERF document
   * @private
   */

  addDocument(_ref3) {
    var _stack$cursor;
    var {
      bookCode,
      perfDocument,
      clone = true
    } = _ref3;
    var {
      stack,
      cursor
    } = this.getBookHistory(bookCode);
    (_stack$cursor = stack[cursor]) !== null && _stack$cursor !== void 0 ? _stack$cursor : stack[cursor] = {};
    stack[cursor].perfDocument = clone ? (0, _default2.default)(perfDocument) : perfDocument;
    return perfDocument;
  }

  /**
   * Sets pipeline data for book in current history position
   * @return {void} void
   */
  setPipelineData(bookCode, data) {
    var _stack$cursor2;
    var {
      stack,
      cursor
    } = this.getBookHistory(bookCode);
    (_stack$cursor2 = stack[cursor]) !== null && _stack$cursor2 !== void 0 ? _stack$cursor2 : stack[cursor] = {};
    var currentData = stack[cursor].pipelineData;
    if (data) stack[cursor].pipelineData = _objectSpread(_objectSpread({}, currentData), data);
  }

  /**
   * Gets pipeline data for book in current history position
   * @param {string} bookCode
   */
  getPipelineData(bookCode) {
    var bookData = this.getBookData(bookCode);
    return bookData === null || bookData === void 0 ? void 0 : bookData.pipelineData;
  }

  /**
   * Exposes Epitelete's internal pipelineHandler instance.
   * @return {PipelineHandler} pipelineHandler instance
   */
  getPipelineHandler() {
    return this.pipelineHandler;
  }

  /**
   * Traverses given PERF document through declared pipeline.
   * @param {string} bookCode - The history bookCode in which to store pipelineData
   * @param {string} pipelineName - The name of the pipeline to be traversed
   * @param {perfDocument} perfDocument - PERF document to run through the pipeline
   * @return {Promise<perfDocument>} - Transformed PERF document
   * @private
   */
  runPipeline(_ref4) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var {
        bookCode,
        pipelineName,
        perfDocument
      } = _ref4;
      if (!pipelineName) return {
        perf: perfDocument
      };
      var storedData = _this.getPipelineData(bookCode);
      var [_inputs] = _this.pipelineHandler.pipelines[pipelineName];
      var {
        inputs
      } = _inputs;
      var data = storedData ? Object.keys(storedData).reduce((data, inputKey) => {
        if (inputKey in inputs) data[inputKey] = storedData[inputKey];
        return data;
      }, {}) : undefined;
      var pipelineArgs = _objectSpread({
        perf: perfDocument
      }, data);
      var _yield$_this$pipeline = yield _this.pipelineHandler.runPipeline(pipelineName, pipelineArgs),
        {
          perf
        } = _yield$_this$pipeline,
        pipelineData = _objectWithoutProperties(_yield$_this$pipeline, _excluded3);
      return {
        perf,
        pipelineData
      };
    })();
  }

  /**
   * Adds given PERF document to history and returns the PERF passed through the specified pipeline.
   * @async
   * @param {string} bookCode
   * @param {perfDocument} perfDocument - PERF document
   * @param {object} [options]
   * @param {string} [options.writePipeline] - name of pipeline to be run through before saving to memory.
   * @param {string} [options.readPipeline] - name of pipeline to be run through after saving to memory.
   * @param {boolean} [options.cloning = true] - turns safe mode
   *
   * @return {Promise<perfDocument>} fetched PERF document
   * @private
   */
  loadPerf(bookCode, perfDocument, options) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var _options$cloning;
      var shouldClone = (_options$cloning = options.cloning) !== null && _options$cloning !== void 0 ? _options$cloning : true;
      var {
        writePipeline,
        readPipeline
      } = options;
      var {
        perf: writePerf,
        pipelineData: writePipelineData
      } = yield _this2.runPipeline({
        bookCode,
        pipelineName: writePipeline,
        perfDocument
      });
      var validatorResult = _this2.validator.validate('constraint', 'perfDocument', '0.3.0', writePerf);
      if (!validatorResult.isValid) {
        throw new Error("writePerf is schema invalid: ".concat(JSON.stringify(validatorResult.errors)));
      }
      _this2.setPipelineData(bookCode, writePipelineData);
      var savedPerf = _this2.addDocument({
        bookCode,
        perfDocument: writePerf,
        clone: shouldClone
      });
      validatorResult = _this2.validator.validate('constraint', 'perfDocument', '0.3.0', savedPerf);
      if (!validatorResult.isValid) {
        throw new Error("savedPerf is schema invalid: ".concat(JSON.stringify(validatorResult.errors)));
      }
      // console.log(JSON.stringify(writePerf, " ", 4));
      var {
        perf: readPerf,
        pipelineData: readPipelineData
      } = yield _this2.runPipeline({
        bookCode,
        pipelineName: readPipeline,
        perfDocument: savedPerf
      });
      validatorResult = _this2.validator.validate('constraint', 'perfDocument', '0.3.0', readPerf);
      if (!validatorResult.isValid) {
        var detailError = validatorResult.errors.map(error => {
          var value = (0, _utils.getPathValue)({
            object: readPerf,
            path: error.instancePath
          });
          return _objectSpread(_objectSpread({}, error), {}, {
            value: JSON.stringify(value, null, 2)
          });
        });
        throw new Error("readPerf is schema invalid: ".concat(JSON.stringify(detailError)));
      }
      _this2.setPipelineData(bookCode, readPipelineData);
      _this2.savePerf(bookCode);
      _this2.notifyObservers({
        action: ACTIONS.LOAD_PERF,
        data: readPerf
      });
      return readPerf;
    })();
  }

  /**
   * Loads given perf into memory
   * @param {string} bookCode
   * @param {perfDocument} perfDocument - PERF document
   * @param {object} [options]
   * @param {string} [options.writePipeline] - name of pipeline to be run through before saving to memory.
   * @param {string} [options.readPipeline] - name of pipeline to be run through after saving to memory.
   * @param {boolean} [options.cloning = true] - turns safe mode
   * @return {Promise<perfDocument>} same sideloaded PERF document
   */
  sideloadPerf(bookCode, perfDocument) {
    var _arguments = arguments,
      _this3 = this;
    return _asyncToGenerator(function* () {
      var options = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : {};
      (0, _utils.validateParams)(["writePipeline", "readPipeline", "cloning"], options, "Unexpected option in sideloadPerf");
      if (_this3.backend === "proskomma") {
        throw "Can't call sideloadPerf in proskomma mode";
      }
      if (!bookCode || !perfDocument) {
        throw "sideloadPerf requires 2 arguments (bookCode, perfDocument)";
      }
      var validatorResult = _this3.validator.validate('constraint', 'perfDocument', '0.3.0', perfDocument);
      if (!validatorResult.isValid) {
        throw "perfJSON is not valid. \n".concat(JSON.stringify(validatorResult, null, 2));
      }
      return yield _this3.loadPerf(bookCode, perfDocument, options);
    })();
  }

  /**
   * Fetches document from proskomma instance
   * @async
   * @param {string} bookCode
   * @param {object} [options]
   * @param {string} [options.writePipeline] - name of pipeline to be run through before saving to memory.
   * @param {string} [options.readPipeline] - name of pipeline to be run through after saving to memory.
   * @param {boolean} [options.cloning = true] - turns safe mode
   * @return {Promise<perfDocument>} fetched PERF document
   */
  fetchPerf(bookCode) {
    var _arguments2 = arguments,
      _this4 = this;
    return _asyncToGenerator(function* () {
      var options = _arguments2.length > 1 && _arguments2[1] !== undefined ? _arguments2[1] : {};
      (0, _utils.validateParams)(["writePipeline", "readPipeline", "cloning"], options, "Unexpected option in fetchPerf");
      if (_this4.backend === "standalone") {
        throw "Can't call fetchPerf in standalone mode";
      }
      if (!bookCode) {
        throw new Error("fetchPerf requires argument (bookCode)");
      }
      if (bookCode.length > 3 || !/^[A-Z0-9]{3}$/.test(bookCode)) {
        throw new Error("Invalid bookCode: \"".concat(bookCode, "\". Only three characters (uppercase letters [A-Z] or numbers [0-9]) allowed."));
      }
      var query = "{docSet(id: \"".concat(_this4.docSetId, "\") { document(bookCode: \"").concat(bookCode, "\") { perf } } }");
      var {
        data
      } = _this4.proskomma.gqlQuerySync(query);
      var queryResult = data.docSet.document.perf;
      if (!queryResult) {
        throw new Error("No document with bookCode=\"".concat(bookCode, "\" found."));
      }
      var perfDocument = JSON.parse(queryResult);
      return yield _this4.loadPerf(bookCode, perfDocument, options);
    })();
  }

  /**
   * Gets document from memory or fetches it if proskomma is set
   * @async
   * @param {string} bookCode
   * @param {object} [options]
   * @param {string} [options.readPipeline] - name of pipeline to be run through after read.
   * @param {boolean} [options.cloning = true] - turns safe mode
   * @return {Promise<perfDocument>} found or fetched PERF document
   */
  readPerf(bookCode) {
    var _arguments3 = arguments,
      _this5 = this;
    return _asyncToGenerator(function* () {
      var _options$cloning2;
      var options = _arguments3.length > 1 && _arguments3[1] !== undefined ? _arguments3[1] : {};
      (0, _utils.validateParams)(["readPipeline", "cloning"], options, "Unexpected option in readPerf");
      var shouldClone = (_options$cloning2 = options.cloning) !== null && _options$cloning2 !== void 0 ? _options$cloning2 : true;
      if (!_this5.history[bookCode] && _this5.backend === "proskomma") {
        return _this5.fetchPerf(bookCode, options);
      }
      if (!_this5.history[bookCode] && _this5.backend === "standalone") {
        throw "No document with bookCode=\"".concat(bookCode, "\" found in memory. Use sideloadPerf() to load the document.");
      }
      var perfDocument = _this5.getDocument(bookCode, shouldClone);
      var {
        readPipeline
      } = options;
      var {
        perf,
        pipelineData
      } = yield _this5.runPipeline({
        bookCode,
        pipelineName: readPipeline,
        perfDocument
      });
      _this5.setPipelineData(bookCode, pipelineData);
      return perf;
    })();
  }

  /**
   * Merges a sequence with the document and saves the new modified document.
   * @param {string} bookCode
   * @param {number} sequenceId - id of modified sequence
   * @param {perfSequence} perfSequence - modified sequence
   * @param {object} [options]
   * @param {string} [options.writePipeline] - name of pipeline to be run through before saving to memory.
   * @param {string} [options.readPipeline] - name of pipeline to be run through after saving to memory.
   * @param {boolean} [options.cloning = true] - turns safe mode
   * @return {Promise<perfDocument>} modified PERF document
   */
  writePerf(bookCode, sequenceId, perfSequence) {
    var _arguments4 = arguments,
      _this6 = this;
    return _asyncToGenerator(function* () {
      var options = _arguments4.length > 3 && _arguments4[3] !== undefined ? _arguments4[3] : {};
      (0, _utils.validateParams)(["writePipeline", "readPipeline", "cloning", "insertSequences"], options, "Unexpected option in writePerf");
      var {
          writePipeline,
          cloning,
          insertSequences
        } = options,
        readOptions = _objectWithoutProperties(options, _excluded4);
      var shouldClone = cloning !== null && cloning !== void 0 ? cloning : true;
      var perfDocument = _this6.getDocument(bookCode, false);
      if (!perfDocument) {
        throw "document not found: ".concat(bookCode);
      }
      if (!perfDocument.sequences[sequenceId]) {
        throw "PERF sequence id not found: ".concat(bookCode, ", ").concat(sequenceId);
      }
      var validatorResult = _this6.validator.validate('constraint', 'perfSequence', '0.3.0', perfSequence);
      if (!validatorResult.isValid) {
        throw "PERF sequence  ".concat(sequenceId, " for ").concat(bookCode, " is not valid: ").concat(JSON.stringify(validatorResult));
      }
      var newSequences = {};
      if (insertSequences) {
        (0, _utils.findNewGraft)(perfSequence, graft => {
          var sequenceId = (0, _utils.generateId)();
          newSequences[sequenceId] = {
            type: graft.subtype,
            blocks: []
          };
          graft.target = sequenceId;
          delete graft.new;
        });
      }
      var {
          sequences: originalSequences
        } = perfDocument,
        perf = _objectWithoutProperties(perfDocument, _excluded5);
      var sequences = _objectSpread(_objectSpread({}, originalSequences), {}, {
        [sequenceId]: shouldClone ? (0, _default2.default)(perfSequence) : perfSequence
      });
      perf["sequences"] = sequences;
      var {
        perf: newPerfDoc,
        pipelineData
      } = yield _this6.runPipeline({
        bookCode,
        pipelineName: writePipeline,
        perfDocument: perf
      });
      newPerfDoc.sequences = _objectSpread(_objectSpread(_objectSpread({}, originalSequences), newSequences), {}, {
        [sequenceId]: newPerfDoc.sequences[sequenceId]
      });
      var history = _this6.history[bookCode];
      history.stack = history.stack.slice(history.cursor);
      history.stack.unshift({
        perfDocument: newPerfDoc
      });
      history.cursor = 0;
      _this6.setPipelineData(bookCode, pipelineData);
      if (history.stack.length > _this6.options.historySize) history.stack.pop();
      var returnedPerf = yield _this6.readPerf(bookCode, readOptions);
      _this6.notifyObservers({
        action: ACTIONS.WRITE_PERF,
        data: returnedPerf
      });
      return returnedPerf;
    })();
  }

  /**
   * Gets previous document from history
   * @param {string} bookCode
   * @param {object} [options]
   * @param {string} [options.readPipeline] - name of pipeline to be run through after read from memory.
   * @param {boolean} [options.cloning = true] - turns safe mode
   * @return {Promise<?perfDocument>} PERF document or null if can not undo
   */
  undoPerf(bookCode, options) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      if (_this7.canUndo(bookCode)) {
        var history = _this7.history[bookCode];
        ++history.cursor;
        var perf = yield _this7.readPerf(bookCode, options);
        _this7.notifyObservers({
          action: ACTIONS.UNDO_PERF,
          data: perf
        });
        return perf;
      }
      return null;
    })();
  }

  /**
   * Gets next document from history
   * @param {string} bookCode
   * @param {object} [options]
   * @param {string} [options.readPipeline] - name of pipeline to be run through after read from memory.
   * @param {boolean} [options.cloning = true] - turns safe mode
   * @return {Promise<?perfDocument>} PERF document or null if can not redo
   */
  redoPerf(bookCode, options) {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      if (_this8.canRedo(bookCode)) {
        var history = _this8.history[bookCode];
        --history.cursor;
        var perf = yield _this8.readPerf(bookCode, options);
        _this8.notifyObservers({
          action: ACTIONS.REDO_PERF,
          data: perf
        });
        return perf;
      }
      return null;
    })();
  }

  /**
   * Checks if able to undo from specific book history
   * @param {string} bookCode
   * @return {boolean}
   */
  canUndo(bookCode) {
    var history = this.history[bookCode];
    if (!history) return false;
    if (history.cursor + 1 === history.stack.length) return false;
    return true;
  }

  /**
   * Checks if able to redo from specific book history
   * @param {string} bookCode
   * @return {boolean}
   */
  canRedo(bookCode) {
    var history = this.history[bookCode];
    if (!history) return false;
    if (history.cursor === 0) return false;
    return true;
  }

  /**
   * ?Checks Perf Sequence
   * @param {perfSequence} perfSequence
   * @return {string[]} array of warnings
   */
  checkPerfSequence(perfSequence) {
    var currentChapter = 0;
    var currentVerse = 0;
    var warnings = perfSequence === null || perfSequence === void 0 ? void 0 : perfSequence.blocks.reduce((warnings, _ref5) => {
      var {
        content: blockContent
      } = _ref5;
      if (Array.isArray(blockContent)) {
        for (var contentBlock of blockContent) {
          if (contentBlock.type === 'mark' && contentBlock.subtype === 'verses') {
            currentVerse++;
            if (currentVerse.toString() !== contentBlock.atts.number) {
              warnings.push("Verse ".concat(contentBlock.atts.number, " is out of order, expected ").concat(currentVerse));
              currentVerse = Number(contentBlock.atts.number);
            }
          }
          if (contentBlock.type === 'mark' && contentBlock.subtype === 'chapter') {
            currentChapter++;
            if (currentChapter.toString() !== contentBlock.atts.number) {
              warnings.push("Chapter ".concat(contentBlock.atts.number, " is out of order, expected ").concat(currentChapter));
              currentChapter = Number(contentBlock.atts.number);
            }
            currentVerse = 0;
          }
        }
      }
      return warnings;
    }, []);
    return warnings;
  }

  /**
   * Get array of book codes from history
   * @return {string[]} array of bookCodes
   */
  localBookCodes() {
    return Object.keys(this.history);
  }

  /**
   * Gets the available books for current docSet.
   * @return {{}} an object with book codes as keys, and values
   * contain book header data
   */
  bookHeaders() {
    var _this$proskomma, _gqlResult$docSet;
    var documentHeaders = {};
    var query = "{ docSet(id: \"".concat(this.docSetId, "\") { documents { headers { key value } } } }");
    var {
      data: gqlResult
    } = ((_this$proskomma = this.proskomma) === null || _this$proskomma === void 0 ? void 0 : _this$proskomma.gqlQuerySync(query)) || {};
    var documents = (gqlResult === null || gqlResult === void 0 ? void 0 : (_gqlResult$docSet = gqlResult.docSet) === null || _gqlResult$docSet === void 0 ? void 0 : _gqlResult$docSet.documents) || this.getDocuments();
    for (var document of documents) {
      var key = null;
      var headers = {};
      for (var header of document.headers) {
        if (header.key === 'bookCode') {
          key = header.value;
        } else {
          headers[header.key] = header.value;
        }
      }
      if (key) {
        documentHeaders[key] = headers;
      }
    }
    return documentHeaders;
  }

  /**
   * Gets document from memory and converts it to usfm
   * @async
   * @param {string} bookCode
   * @param {object} [options]
   * @param {string} [options.readPipeline] - name of pipeline to be run through before usfm conversion.
   * @return {Promise<string>} converted usfm
   */
  readUsfm(bookCode, options) {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      var perf = yield _this9.readPerf(bookCode, options);
      if (_this9.pipelineHandler === null) _this9.instanciatePipelineHandler();
      var output = yield _this9.pipelineHandler.runPipeline("perfToUsfmPipeline", {
        perf: perf
      });
      return output.usfm;
    })();
  }

  /**
   * Generates and returns a report via a transform pipeline
   * @async
   * @param {string} bookCode
   * @param {string} reportName
   * @param {object} data
   * @return {Promise<array>} A report
   */
  makeDocumentReport(bookCode, reportName, data) {
    var _this10 = this;
    return _asyncToGenerator(function* () {
      if (!_this10.localBookCodes().includes(bookCode)) {
        throw new Error("bookCode '".concat(bookCode, "' is not available locally"));
      }
      if (_this10.pipelineHandler === null) _this10.instanciatePipelineHandler();
      data.perf = _this10.getDocument(bookCode);
      return yield _this10.pipelineHandler.runPipeline(reportName, data);
    })();
  }

  /**
   * Generates and returns a report for each document via a transform pipeline
   * @async
   * @param {string} reportName
   * @param {object} data
   * @return {Promise<object>} reports for each documents with bookCode as the key
   */
  makeDocumentsReport(reportName, data) {
    var _this11 = this;
    return _asyncToGenerator(function* () {
      var bookCodes = _this11.localBookCodes();
      var ret = {};
      for (var bookCode of bookCodes) {
        var bookReport = yield _this11.makeDocumentReport(bookCode, reportName, data);
        ret[bookReport.matches.bookCode] = bookReport;
      }
      return ret;
    })();
  }
}
var _default = Epitelete;
/**
 * A content element, ie some form of (possibly nested) markup
 * @typedef {object} contentElementPerf Element
 * @property {"mark"|"wrapper"|"start_milestone"|"end_milestone"|"graft"} type The type of element
 * @property {string} [subtype] The subtype of the element, which is context-dependent
 * @property {object} [atts] An object containing USFM attributes or subtype-specific additional information (such as the number of a verse or chapter). The value may be a boolean, a string or an array of strings
 * @property {string} [target] The id of the sequence containing graft content
 * @property {perfSequence} [sequence] The sequence containing graft content
 * @property {string} [preview_text] An optional field to provide some kind of printable label for a graft
 * @property {boolean} [new] If present and true, is interpreted as a request for the server to create a new graft
 * @property {contentElementPerf} [content] Nested content within the content element
 * @property {contentElementPerf} [meta_content] Non-Scripture content related to the content element, such as checking data or related resources
 */
/**
 * A block, which represents either a paragraph of text or a graft
 * @typedef {object} blockOrGraftPerf
 * @property {"paragraph"|"graft"} type The type of block
 * @property {string} [subtype] A type-specific subtype
 * @property {string} [target] The id of the sequence containing graft content
 * @property {perfSequence} [sequence] The sequence containing graft content
 * @property {string} [preview_text] An optional field to provide some kind of printable label for a graft
 * @property {boolean} [new] If present and true, is interpreted as a request for the server to create a new graft
 * @property {object} [atts] An object containing USFM attributes or subtype-specific additional information (such as the number of a verse or chapter). The value may be a boolean, a string or an array of strings
 * @property {Array<string|contentElementPerf>} [content] The content of the block
 */
/**
 * A sequence contains a 'flow' of one or more blocks
 * @typedef {object} perfSequence
 * @property {string} type The type of sequence
 * @property {string} [preview_text] An optional field to provide some kind of printable label
 * @property {blockOrGraftPerf[]} [blocks] The blocks that, together, represent the 'flow' of the sequence
 */
/**
 * A document, typically corresponding to a single USFM or USX book
 * @typedef {object} perfDocument
 * @property {object} schema
 * @property {"flat"|"nested"} schema.structure The basic 'shape' of the content
 * @property {string} schema.structure_version the semantic version of the structure schema
 * @property {array} schema.constraints
 * @property {object} metadata Metadata describing the document and the translation it belongs to
 * @property {object} [metadata.translation] Metadata concerning the translation to which the document belongs
 * @property {array} [metadata.translation.tags] Tags attached to the translation
 * @property {object} [metadata.translation.properties] Key/value properties attached to the translation
 * @property {object} [metadata.translation.selectors] Proskomma selectors for the translation that, together, provide a primary key in the translation store
 * @property {object} [metadata.document] Metadata concerning the document itself
 * @property {array} [metadata.document.tags] Tags attached to the document
 * @property {object} [metadata.document.properties] Key/value properties attached to the document
 * @property {string} [metadata.document.chapters]
 * @property {Object<string,perfSequence>} [sequences]
 * @property {perfSequence} [sequence]
 * @property {string} [main_sequence_id]
 */
/**
 * @typedef {string} bookCode
 */
/**
 * @typedef {Object} bookHistory
 * @property {number} bookHistory.cursor
 * @property {Object[]} bookHistory.stack
 * @property {perfDocument} bookHistory.stack[].perfDocument
 * @property {Object<string,any>} bookHistory.stack[].pipelineData
 */
/**
 * @typedef {Object<string, bookHistory>} history
 */
/**
 * @typedef {Object<string, perfDocument>} saved
 */
/**
 * Proskomma instance
 * @typedef Proskomma
 * @see {@link https://github.com/mvahowe/proskomma-js}
 */
/**
 * PipelineHandlers instance
 * @typedef {typeof import('proskomma-json-tools').PipelineHandler} PipelineHandler
 * @see {@link https://github.com/DanielC-N/pipelineHandler}
 */
exports.default = _default;