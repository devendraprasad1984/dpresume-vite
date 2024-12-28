import {ASTERISK, DOT, HYPHEN, UNDERSCORE, WHITESPACE} from "../const/const.js";
import {core} from "../core.js";

//PROTOTYPE inheritance gives best performance with primitive data types
String.prototype.nopx = function (defaultValue = "") {
  return core.coalesce(this, defaultValue).replace("px", "");
};

String.prototype.ifTrue = function () {
  return this.toString() === "true" || false;
};

String.prototype.replaceChars = function (char1, char2) {
  return this.replaceAll(char1, char2);
};

String.prototype.removeChar = function (char) {
  return this.replaceChars(char, "");
};

String.prototype.removeWhitespace = function () {
  return this.removeChar(WHITESPACE);
};

String.prototype.removeHyphens = function () {
  return this.removeChar(HYPHEN);
};

String.prototype.removeSpecialChars = function () {
  return this.removeChar(/[^0-9a-zA-Z]/g);
};

String.prototype.removeUnderscore = function () {
  return this.removeChar(UNDERSCORE);
};

String.prototype.removeDots = function () {
  return this.removeChar(DOT);
};

String.prototype.noSpace = function (defaultValue = "") {
  let str = this || "";
  str = str.removeWhitespace();
  if (core.allTrue([
    !core.isPresent(str),
    core.isPresent(defaultValue)
  ])) {
    return defaultValue;
  }
  return str;
};

String.prototype.capitalizeFirstLetter = function () {
  if (!core.isPresent(this)) {
    return "";
  }
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.removeLastChar = function () {
  const length = this.length;
  return this.substring(0, length - 1);
};

String.prototype.padStar = function (padLength = 5) {
  return ASTERISK.repeat(padLength) + String(this).substring(padLength);
};
