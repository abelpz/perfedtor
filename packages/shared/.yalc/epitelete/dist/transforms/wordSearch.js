"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _proskommaJsonTools = require("proskomma-json-tools");
var _xregexp = _interopRequireDefault(require("xregexp"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var splitWords = (0, _xregexp.default)('([\\p{Letter}\\p{Number}\\p{Mark}\\u2060]{1,127})');
var localWordSearchActions = {
  startDocument: [{
    description: "Set up state variables and output",
    test: () => true,
    action: _ref => {
      var {
        config,
        context,
        workspace,
        output
      } = _ref;
      workspace.chapter = null;
      workspace.verses = null;
      workspace.matches = new Set([]);
      workspace.chunks = [];
      if (config.regex) {
        workspace.regex = new RegExp(config.toSearch, config.regexFlags);
      }
    }
  }],
  mark: [{
    description: "Update CV state",
    test: () => true,
    action: _ref2 => {
      var {
        config,
        context,
        workspace,
        output
      } = _ref2;
      var element = context.sequences[0].element;
      if (element.subType === 'chapter') {
        doSearch(workspace, config);
        workspace.chapter = element.atts['number'];
        workspace.chunks = [];
      } else if (element.subType === 'verses') {
        doSearch(workspace, config);
        workspace.verses = element.atts['number'];
        workspace.chunks = [];
      }
    }
  }],
  text: [{
    description: "Add matching verses to set",
    test: _ref3 => {
      var {
        context,
        workspace
      } = _ref3;
      return workspace.chapter && workspace.verses;
    },
    action: _ref4 => {
      var {
        config,
        context,
        workspace,
        output
      } = _ref4;
      var text = context.sequences[0].element.text;
      workspace.chunks.push(text);
    }
  }],
  endDocument: [{
    description: "Sort matches",
    test: () => true,
    action: _ref5 => {
      var _context$document, _context$document$met, _context$document$met2;
      var {
        config,
        context,
        workspace,
        output
      } = _ref5;
      output.bookCode = (context === null || context === void 0 ? void 0 : (_context$document = context.document) === null || _context$document === void 0 ? void 0 : (_context$document$met = _context$document.metadata) === null || _context$document$met === void 0 ? void 0 : (_context$document$met2 = _context$document$met.document) === null || _context$document$met2 === void 0 ? void 0 : _context$document$met2.bookCode) || '';
      output.searchTerms = Array.isArray(config.toSearch) ? config.toSearch.join(' ') : config.toSearch;
      output.options = [];
      if (config.ignoreCase) {
        output.options.push('ignoreCase');
      }
      if (config.andLogic) {
        output.options.push('andLogic');
      }
      if (config.orLogic) {
        output.options.push('orLogic');
      }
      if (config.partialMatch) {
        output.options.push('partialMatch');
      }
      if (config.regex) {
        output.options.push('regex');
      }
      doSearch(workspace, config);
      output.matches = Array.from(workspace.matches).sort((a, b) => a.chapter * 1000 + a.verses - (b.chapter * 1000 + b.verses));
    }
  }]
};
var addMatch = function addMatch(workspace, config) {
  var match = {
    chapter: workspace.chapter,
    verses: workspace.verses,
    content: []
  };
  var search = config.toSearch;
  var config_ = _objectSpread(_objectSpread({}, config), {}, {
    andLogic: false // for highlighting we match any found
  });

  var text = workspace.chunks.join('');
  var words = _xregexp.default.split(text, splitWords);
  for (var value of words) {
    if (value) {
      var found = findMatch(config_, value, search, workspace);
      if (found) {
        match.content.push({
          type: "wrapper",
          subtype: "x-search-match",
          content: [value]
        });
      } else {
        match.content.push(value);
      }
    }
  }
  workspace.matches.add(match);
};
function findMatch(config, text, search, workspace) {
  if (config.regex) {
    return workspace.regex.test(text);
  }
  var isSearchArray = Array.isArray(search);
  if (config.ignoreCase) {
    text = text.toLowerCase();
    if (isSearchArray) {
      search = search.map(item => item.toLowerCase());
    } else {
      search = search.toLowerCase();
    }
  }
  if (!isSearchArray) {
    search = [search];
  }
  if (!config.partialMatch) {
    // if word search, we separate text into array of words to match
    var words = _xregexp.default.split(text, splitWords);
    text = words;
  }
  var allMatched = true;
  var anyMatched = false;
  for (var searchTerm of search) {
    var found = text.includes(searchTerm);
    if (!found) {
      allMatched = false;
    } else {
      anyMatched = true;
    }
  }
  if (config.andLogic) {
    return allMatched;
  } else {
    // doing or logic
    return anyMatched;
  }
}
var doSearch = function doSearch(workspace, config) {
  if (workspace.chunks.length) {
    var text = workspace.chunks.join('');
    var search_ = config.toSearch;
    var found = findMatch(config, text, search_, workspace);
    if (found) {
      addMatch(workspace, config);
    }
  }
};
var wordSearchCode = function wordSearchCode(_ref6) {
  var {
    perf,
    searchString,
    ignoreCase = '1',
    logic = '',
    regex = '0',
    partialMatch = '0'
  } = _ref6;
  var cl = new _proskommaJsonTools.PerfRenderFromJson({
    srcJson: perf,
    actions: localWordSearchActions
  });
  var output = {};
  var ignoreCase_ = ignoreCase.trim() === '1';
  logic = logic.trim().substring(0, 1).toUpperCase();
  var andLogic_ = logic === 'A';
  var orLogic_ = logic === 'O';
  var partialMatch_ = partialMatch && partialMatch.trim() === '1';
  var regex_ = regex.trim() === '1';
  var toSearch = searchString.trim();
  if (!regex_) {
    if (toSearch.includes('?') || toSearch.includes('*')) {
      // check for wildcard characters
      var newSearch = toSearch.replaceAll('?', '\\S{1}');
      newSearch = newSearch.replaceAll('*', '\\S*');
      if (!partialMatch_) {
        newSearch = '\\b' + newSearch + '\\b';
      }
      toSearch = '/' + newSearch + '/';
    }
  }
  var regexFlags = '';
  if (toSearch.startsWith('/') && toSearch.includes('/', 2)) {
    regex_ = true;
    var regexParts = toSearch.split('/');
    toSearch = regexParts[1];
    regexFlags = regexParts[2];
    if (ignoreCase_ && !regexFlags.includes('i')) {
      regexFlags += 'i';
    }
  } else if ((andLogic_ || orLogic_) && toSearch) {
    toSearch = toSearch.split(' ');
  }
  cl.renderDocument({
    docId: "",
    config: {
      toSearch,
      ignoreCase: ignoreCase_,
      andLogic: andLogic_,
      orLogic: orLogic_,
      partialMatch: partialMatch_,
      regex: regex_,
      regexFlags
    },
    output
  });
  return {
    matches: output
  };
};
var wordSearch = {
  name: "wordSearch",
  type: "Transform",
  description: "PERF=>JSON: Searches for a word",
  inputs: [{
    name: "perf",
    type: "json",
    source: ""
  }, {
    name: "searchString",
    type: "text",
    source: ""
  }, {
    name: "ignoreCase",
    // expect '1' to enable case insensitive, otherwise we do case sensitive searching
    type: "text",
    source: ""
  }, {
    name: "regex",
    // expect '1' to enable
    type: "text",
    source: ""
  }, {
    name: "logic",
    // expect 'A' to enable AND logic, 'O' to enable OR logic, default is exact match search string
    type: "text",
    source: ""
  }, {
    name: "partial",
    // expect '1' to enable partial match of words/string, otherwise we do full word matching
    type: "text",
    source: ""
  }],
  outputs: [{
    name: "matches",
    type: "json"
  }],
  code: wordSearchCode
};
var _default = wordSearch;
exports.default = _default;