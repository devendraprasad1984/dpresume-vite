// this is an independent "core" script
// IMPORTANT: please ensure that there is NO import in this file, except constants
import {chars} from "./const/chars.js";
import {DOT, FUNCTION_TYPE, HTML_EXTENSION, UNDEFINED_TYPE, WHITESPACE} from "./const/const.js";
import {promiseToCatch, promiseToThen} from "./helper/unhandledPromises.js";

const stringifyReplacer = (key, val) => {
  let seen = [];
  if (typeof val == "object") {
    if (seen.indexOf(val) >= 0) {
      return;
    }
    seen.push(val);
  }
  return val;
};

const stringToDOMNode = htmlStr => {
  return document?.createRange().createContextualFragment(htmlStr);
};

const sanitiseHTML = htmlStr => {
  if (!isPresent(htmlStr)) {
    return "";
  }
  if (!window) {
    return;
  }
  let tmp = document?.createElement("DIV");
  tmp.innerHTML = htmlStr;
  return tmp.textContent || tmp.innerText || "";
};

const sanitize = html => {
  return sanitiseHTML(html);
};

const sanitizeScriptTag = html => {
  let scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  return html.replaceAll(scriptRegex, "");
};

const stringify = value => {
  if (!isObjectPresent(value)) {
    return "";
  }
  switch (typeof value) {
    case "string": {
      return String(value);
    }
    case "object":
      return JSON.stringify(value, stringifyReplacer);
    default:
      return String(value);
  }
};

const isString = (val) => typeof val === "string";
const isFunction = (val) => typeof val === FUNCTION_TYPE;
const isNumber = (val) => typeof val === "number";
const isBoolean = (val) => typeof val === "boolean";
const isNull = val => val === null || val === undefined || val === "null" || typeof val === "undefined";
const isArray = val => typeof val === "object" && !isNull(val) && val?.length > 0 && Array.isArray(val);
const isObject = val => typeof val === "object" && !isNull(val) && !isArray(val);

const parseJSON = obj => {
  if (anyTrue(!isObjectPresent(obj), !isPresent(obj))) {
    return null; // be definitive
  }
  try {
    return JSON.parse(obj);
  } catch (error) {
    return null;
  }
};

const stringifyAndParse = obj => {
  if (!isPresent(obj)) {
    return {};
  }
  return parseJSON(stringify(obj));
};

const getFirstElement = (val, separator) => {
  const value = nullSafeString(val);
  if (value.indexOf(separator) !== -1) {
    const splitArr = nullSafeString(value).split(separator);
    return nullSafeTrim(splitArr[0]);
  }
  return value;
};

const anyTrue = (...args) => {
  //implicit param: args, array will be at 0th index, intentional handling
  //this can be called as anyTrue([a,b]) or anyTrue(a,b)
  let arr = typeof args[0] !== "object" ? [...args] : args[0];
  return arr.indexOf(true) !== -1;
};

const allTrue = (...args) => {
  //implicit param: args, array will be at 0th index, intentional handling
  //this can be called as allTrue([a,b]) or allTrue(a,b)
  let arr = typeof args[0] !== "object" ? [...args] : args[0];
  return arr.filter(v => v === true).length === arr.length;
};

const ifNull = (value) => isNull(value);
const ifNaN = (value) => (ifNull(value) || Number.isNaN(value) || value === "");
const isObjectPresent = value => (value !== null && value !== undefined);
const isObjectBlank = value => Object.keys(value || {}).length === 0;
const isPresent = value => isObjectPresent(value) && value !== UNDEFINED_TYPE && value !== "null" && stringify(value).trim() !== "";
const isBlank = (value) => !isPresent(value);
const isAbsPresent = value => isPresent(value) && value !== "0" && value !== 0 && value !== "0.00";
const isArrayPresent = value => Array.isArray(value) && value.length > 0;
const isDecimalValue = value => value.toString().indexOf(DOT) !== -1;
const areStringsEqual = (value1, value2) => nullSafeString(value1) === nullSafeString(value2);
const areStringsEqualIG = (value1, value2) => nullSafeString(value1).toLowerCase() === nullSafeString(value2).toLowerCase();
const nullSafeString = value => (isPresent(value) ? value : "");
const nullSafeInteger = value => (isNumber(value) ? value : 0);
const nullSafeTrim = (value) => (isNumber(value)) ? value : nullSafeString(value).trim();
const convertToString = value => (isObjectPresent(value) ? value.toString() : "");
const ifTrue = val => (val !== null && (val === true || val === "true" || val === "TRUE" || val === 1 || val === "1"));
const ifFalse = val => (val === null || val === false || val === "false" || val === "FALSE" || val === 0 || val === "0");
const deepCopy = obj => stringifyAndParse(obj);
const zeroIfNull = val => isAbsPresent(val) ? val : 0;
const getFileExtension = value => nullSafeString(value).substring(nullSafeString(value).lastIndexOf(DOT));
const stringToArray = (value, delimiter = DOT) => {
  return nullSafeString(value).toString().split(delimiter);
};

const getUniqueObjectsByKey = (array, key) => {
  return [...new Map(array.map(item => [item[key], item])).values()];
};

const getInputKeyVal = (e, values) => {
  if (!isObjectPresent(e)) {
    return {
      name: "",
      value: ""
    };
  }
  const name = !isObjectPresent(values) ? e.target.name : values.name;
  const value = !isObjectPresent(values) || !isObjectPresent(values?.value) ? nullSafeString(e.target.value) : nullSafeString(values.value) || "";
  return {
    name,
    value
  };
};

const bankersRound = (n, d = 2) => {
  let x = n * Math.pow(10, d);
  let r = Math.round(x);
  let br = Math.abs(x) % 1 === 0.5 ? (r % 2 === 0 ? r : r - 1) : r;
  return br / Math.pow(10, d);
};

const getCurrencySymbol = (locale, currency) => (0).toLocaleString(coalesce(nullSafeString(locale), "en-US"), {
  style: "currency",
  currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).replace(/\d/g, "").trim();

const isCurrentTabSelected = () => document.visibilityState !== "visible";

const getRandomValue = valuesArr => {
  const rndNum = parseInt(Math.random() * valuesArr.length);
  const val = valuesArr[rndNum];
  return val || valuesArr[0];
};

const getRandomColor = () => {
  const h = getRandomNumber(360);
  const s = getRandomNumber(100);
  const l = getRandomNumber(100);
  return `hsl(${h}deg, ${s}%, ${l}%)`;
};

const getRandomNumber = (maxNum) => {
  return Math.floor(Math.random() * maxNum);
};

const hasProperty = (object, key) => (object ? Object.hasOwnProperty.call(object, key) : false);

const objectsDeepEqual = (o1, o2) => {
  const areObjects = typeof o1 === "object" && typeof o2 === "object";
  const notZero = Object.keys(o1).length > 0 && Object.keys(o2).length > 0;
  const haveEqualLengthOfKeys = Object.keys(o1).length === Object.keys(o2).length;
  return areObjects && notZero && haveEqualLengthOfKeys ? stringify(o1) === stringify(o2) : o1 === o2;
};

const getObjectKey = (object) => {
  return core.isObjectPresent(object) ? Object.keys(object) : [""];
};

const coalesce = (value, defaultValue) => (anyTrue(nullSafeString(value) === "", !isPresent(value)) ? defaultValue : value);
const trimCoalesce = (value, defaultValue) => nullSafeTrim(coalesce(value, defaultValue));

const makeStar = star => "★★★★★☆☆☆☆☆".slice(5 - star, 10 - star);

const ternaryOperation = (condition, left, right) => {
  return condition ? left : right;
};

const ifBlankValue = (val) => val === "";

const debounce = (func, delay = 500 * 2.5) => {
  let debounceTimer;
  return function () {
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout((context) => func.apply(context, args), delay, this);
  };
};

const isColorCode = color => anyTrue(color.substring(0, 1) === "#", color.substring(0, 1) === "(");

const getCapitalizedString = (string) => {
  if (!isPresent(string)) {
    return "";
  }
  return string.split(WHITESPACE).map(item => {
    if (!isPresent(item)) {
      return "";
    }
    return item.charAt(0).toUpperCase() + item.substr(1).toLowerCase();
  }).join(WHITESPACE);
};

const isValidationFailed = (validator) => anyTrue(validator.isFailed, validator.isRegExFailed);

// an empty function that does nothing,
// handy to use as a placeholder or default params
const noop = () => undefined;

const copy = value => {
  try {
    //TODO: bring toastr on promise completion
    navigator?.clipboard?.writeText(value).then(promiseToThen).catch(promiseToCatch);
  } catch {
    //TODO: make these part of core functions, alert the customer for not copied
  }
};

const getHTMLExtension = () => {
  return HTML_EXTENSION;
};

function getFnName(fn) {
  let f = typeof fn == "function";
  let s = f && ((fn.name && ["", fn.name]) || fn.toString().match(/function ([^\(]+)/));
  return (!f && "not a function") || (s && s[1] || "anonymous");
}

const getCalleeName = (that) => {
  if (typeof that === "string") {
    return that;
  }
  //in strict mode, arguments.<caller/callee> doesn't work
  if (!isObjectPresent(that)) {
    return "no function name";
  }
  that = that.bind(that);
  return getFnName(that);
};

const uniqueInArray = (arr) => {
  if (!isArrayPresent(arr)) {
    return [];
  }
  return [...new Set(arr)];
};

const upperCase = (val) => nullSafeString(val).trim().toUpperCase();
const lowerCase = (val) => nullSafeString(val).trim().toLowerCase();
const sleep = async (value = 1000) => await new Promise(resolve => setTimeout(resolve, value));

const mergeClasses = (...rest) => {
  if (ifFalse(rest)) {
    return;
  }

  return rest
    .flat()
    .filter(Boolean)
    .map(item => {
      if (typeof item === "object") {
        return Object.keys(item).filter(key => item[key]);
      }
      return item;
    })
    .flat()
    .join(" ");
};

const removeDuplicates = (arr, toKey) => {
  if (!isArrayPresent(arr)) {
    return [];
  }
  if (!isFunction(toKey)) {
    return arr;
  }
  const map = arr.reduce((acc, value) => {
    const key = toKey(value);
    if (!acc.has(key)) {
      acc.set(key, value);
    }
    return acc;
  }, new Map());
  return Array.from(map.values());
};

const getKeys = obj => Object.keys(obj);
const getValues = obj => Object.values(obj);

const core = {
  chars,
  contactAuthor: () => {
    return "devendraprasad1984@gmail.com | +91 958 279 7772";
  },
  sleep,
  copy,
  getHTMLExtension,
  stringToDOMNode,
  sanitiseHTML,
  sanitize,
  stringify,
  isBoolean,
  parseJSON,
  stringifyAndParse,
  anyTrue,
  allTrue,
  isNull,
  ifNull,
  ifNaN,
  ifTrue,
  ifFalse,
  isObjectPresent,
  isObjectBlank,
  isPresent,
  isBlank,
  isAbsPresent,
  isArrayPresent,
  isDecimalValue,
  stringToArray,
  areStringsEqual,
  nullSafeString,
  nullSafeTrim,
  nullSafeInteger,
  deepCopy,
  zeroIfNull,
  getUniqueObjectsByKey,
  getInputKeyVal,
  bankersRound,
  getCurrencySymbol,
  isCurrentTabSelected,
  getRandomValue,
  getRandomColor,
  getRandomNumber,
  hasProperty,
  objectsDeepEqual,
  getObjectKey,
  coalesce,
  trimCoalesce,
  makeStar,
  ternaryOperation,
  ifBlankValue,
  debounce,
  isColorCode,
  sanitizeScriptTag,
  convertToString,
  getCapitalizedString,
  isValidationFailed,
  isEmailInvalid: isValidationFailed,
  noop,
  areStringsEqualIG,
  getCalleeName,
  isString,
  isFunction,
  getFileExtension,
  uniqueInArray,
  upperCase,
  lowerCase,
  getFirstElement,
  mergeClasses,
  removeDuplicates,
  stringifyReplacer,
  isArray,
  isObject,
  getKeys,
  getValues
};

export default core;
