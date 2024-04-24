"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateParams = exports.removeAttribute = exports.getPathValue = exports.generateId = exports.findObject = exports.findNewGraft = void 0;
var _pureUuid = _interopRequireDefault(require("pure-uuid"));
var _base = _interopRequireDefault(require("base-64"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var validateParams = (expectedParams, params, errorMessage) => {
  var _expectedParams = new Set(expectedParams);
  var unknownParams = Object.keys(params).filter(p => !_expectedParams.has(p));
  if (unknownParams.length > 0) {
    throw new Error("".concat(errorMessage, ". Expected one of: [").concat([..._expectedParams].join(', '), "], But got: [").concat(unknownParams.join(', '), "]"));
  }
};
exports.validateParams = validateParams;
var removeAttribute = (obj, attributeName) => {
  var outObject, value, key;
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(obj) ? [] : {};
  for (key in obj) {
    if (key == attributeName && Object.keys(obj[key]).length === 0) continue;
    value = obj[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = removeAtts(value);
  }
  return outObject;
};
exports.removeAttribute = removeAttribute;
var getPathValue = _ref => {
  var {
    object,
    path
  } = _ref;
  return path.split("/").reduce((value, key) => {
    value = value[key];
    return value;
  }, object);
};
exports.getPathValue = getPathValue;
var generateId = () => _base.default.encode(new _pureUuid.default(4)).substring(0, 12);
exports.generateId = generateId;
var findObject = function findObject() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var key = arguments.length > 1 ? arguments[1] : undefined;
  var value = arguments.length > 2 ? arguments[2] : undefined;
  var result = [];
  var recursiveSearch = function recursiveSearch() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!obj || typeof obj !== 'object') {
      return;
    }
    ;
    if (obj[key] === value) {
      result.push(obj);
    }
    ;
    Object.keys(obj).forEach(function (k) {
      recursiveSearch(obj[k]);
    });
  };
  recursiveSearch(obj);
  return result;
};
exports.findObject = findObject;
var findNewGraft = function findNewGraft() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var onNewGraft = arguments.length > 1 ? arguments[1] : undefined;
  var result = [];
  var recursiveSearch = function recursiveSearch() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (!obj || typeof obj !== 'object') {
      return;
    }
    ;
    if (obj.type === "graft" && obj.new) {
      result.push(obj);
      onNewGraft(obj);
    }
    ;
    if (obj.blocks) {
      obj.blocks.forEach(function (block) {
        recursiveSearch(block);
      });
    }
    if (obj.content) {
      obj.content.forEach(function (contentElement) {
        recursiveSearch(contentElement);
      });
    }
  };
  recursiveSearch(obj);
  return result;
};
exports.findNewGraft = findNewGraft;