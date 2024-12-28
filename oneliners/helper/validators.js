import {core} from "../core/core.js";
import {formattedValues} from "../core/utils/formattedValues.js";
import {ccRegex} from "./creditCardValidator.js";
import regExTypes from "./regExTypes.js";
import regEx from "./regexValues.js";

const validateCardAttribute = (e, length) => {
  if (!core.isObjectPresent(e)) {
    return;
  }
  const attribute = e.target.value || "";
  if (core.anyTrue([!core.isPresent(attribute), attribute.length !== length])) {
    e.target.classList.add("red-border");
  } else {
    e.target.classList.add("green-border");
  }
};

const validateCardAttributeReactive = (value, length) => {
  return !core.anyTrue([!core.isPresent(value), value.length !== length]);
};

export const validatorRegExTypes = {
  ...regExTypes
};

function validatedPOBox(value) {
  let tempValue = value;
  if (core.isArrayPresent(value)) {
    tempValue = value.join("");
  }
  const updatedValue = core.nullSafeString(tempValue).toLowerCase();
  const formattedValue = updatedValue.removeWhitespace().removeDots().removeHyphens().removeUnderscore();
  const poArray = ["P.O. Box", "PO Box", "POBox", "P.O.Box", "Box P.O.", "Box PO", "BoxPo", "Box.P.O"].map(x => x.removeWhitespace().toLowerCase());
  const valuePresentInPOArray = poArray.indexOf(formattedValue) !== -1;
  const anyArrayValuePresentInValue = core.isArrayPresent(poArray.filter(v => formattedValue.indexOf(v) !== -1));
  const re = regEx[regExTypes.pobox];
  return core.anyTrue(updatedValue.match(re) !== null, valuePresentInPOArray, anyArrayValuePresentInValue);
}

export const sanitizeChar = regex => {
  return char => {
    if (new RegExp(regex).test(char)) {
      return char;
    }
    return "";
  };
};

export const handlePaste = (onChange, sanitizer) => {
  return event => {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    const transformedText = text.split("").map(sanitizer).join("").trim();
    onChange(transformedText);
  };
};
export const sanitizeEscape = string => {
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;"
  };

  return string.replace(/[&<>"'/]/g, match => htmlEscapes[match]);
};

export const decodeEscape = string => {
  const htmlEscapes = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#x27;": "'",
    "&#x2F;": "/"
  };

  return string.replace(/&amp;/g, "&").replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, match => htmlEscapes[match]);
};
const encodeEmojisOnly = (text) => {
  const matches = text.matchAll(regEx[regExTypes.emoji]);

  let encodedText = text;
  for (const match of matches) {
    const emoji = match[0];
    const encodedEmoji = encodeURIComponent(emoji);
    encodedText = encodedText.replace(emoji, encodedEmoji);
  }

  return encodedText;
};
export const validatorsObj = {
  validateCardAttribute,
  validateCardAttributeReactive,
  [regExTypes.required]: value => value !== "",
  [regExTypes.phone]: value => value.match(regEx[regExTypes.phone]),
  [regExTypes.email]: value => value.match(regEx[regExTypes.email]),
  [regExTypes.name]: value => new RegExp(regEx[regExTypes.name]).test(value),
  [regExTypes.stepper]: value => new RegExp(regEx[regExTypes.stepper]).test(value.toString()),
  [regExTypes.amount]: value => new RegExp(regEx[regExTypes.amount]).test(value.toString()),
  [regExTypes.amountDecimal]: value => new RegExp(regEx[regExTypes.amountDecimal]).test(value.toString()),
  [regExTypes.creditCard]: function (value) {
    let newValue = formattedValues.getFormattedCardInputValue(value);
    let results = Object.keys(ccRegex).map(reg => {
      return new RegExp(ccRegex[reg]).test(newValue);
    });
    return results.indexOf(true) !== -1; //if any regex is failing, cc validation is failing
  },
  [regExTypes.currencySymbol]: value => new RegExp(regEx[regExTypes.currencySymbol]).test(value),
  [regExTypes.mustContainSpace]: value => new RegExp(regEx[regExTypes.mustContainSpace]).test(value.toString()),
  [regExTypes.noSpecialCharacters]: value => new RegExp(regEx[regExTypes.noSpecialCharacters]).test(value.toString()),
  [regExTypes.noSpecialCharactersSpaceAllowed]: value => new RegExp(regEx[regExTypes.noSpecialCharactersSpaceAllowed]).test(value.toString()),
  [regExTypes.noSpecialCharactersButHyphenAllowed]: value => new RegExp(regEx[regExTypes.noSpecialCharactersButHyphenAllowed]).test(value.toString()),
  [regExTypes.carrierMessage]: value => new RegExp(regEx[regExTypes.carrierMessage]).test(value.toString()),
  [regExTypes.carrierFrom]: value => new RegExp(regEx[regExTypes.carrierFrom]).test(value.toString()),
  [regExTypes.cvv]: value => new RegExp(regEx[regExTypes.cvv]).test(value.toString()),
  [regExTypes.usZipCode]: value => new RegExp(regEx[regExTypes.usZipCode]).test(value.toString()),
  [regExTypes.quantity]: value => new RegExp(regEx[regExTypes.quantity]).test(value.toString()),
  [regExTypes.onlyAlphabets]: value => new RegExp(regEx[regExTypes.onlyAlphabets]).test(value.toString()),
  [regExTypes.nospace]: value => new RegExp(regEx[regExTypes.nospace]).test(value.toString()),
  [regExTypes.orderNumber]: value => new RegExp(regEx[regExTypes.orderNumber]).test(value.toString()),
  [regExTypes.pobox]: value => validatedPOBox(value),
  [regExTypes.searchBoxRegEx]: value => new RegExp(regEx[regExTypes.searchBoxRegEx]).test(value.toString()),
  [regExTypes.expiry]: value => new RegExp(regEx[regExTypes.expiry]).test(value.toString()),
  [regExTypes.emoji]: value => new RegExp(regEx[regExTypes.emoji]).test(value),
  sanitizeEscape,
  decodeEscape,
  encodeEmojisOnly
};
