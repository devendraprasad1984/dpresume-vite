import regExTypes from "./regExTypes.js";

export default {
  [regExTypes.postcode]: /^[0-9]{5}(?:-[0-9]{4})?$/,
  [regExTypes.phone]: /^[]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/im,
  [regExTypes.email]: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/im,
  [regExTypes.name]: "^[p{L} ,.'-]+$",
  [regExTypes.stepper]: "^([1-9]\\d?|100)$",
  [regExTypes.amount]: "^([1-9]\\d?|10000)$",
  [regExTypes.amountDecimal]: /(^[0-9]*(\.[0-9]{0,2})?$)|Backspace|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Tab|^\d+\.$/,
  [regExTypes.currencySymbol]: "[¥円$€£₹₽₩₪₨₴₦₢₣₱₮₭₲₾₺₵₠₡₤₥₧₫₯₰₳]",
  [regExTypes.mustContainSpace]: "^(.*\\s+.*)+$",
  [regExTypes.noSpecialCharacters]: "^[A-Za-z0-9. ]*$",
  [regExTypes.noSpecialCharactersSpaceAllowed]: "^[A-Za-z0-9. ]*$",
  [regExTypes.searchBoxRegEx]: "^[a-zA-Z0-9 &']+$",
  [regExTypes.noSpecialCharactersButHyphenAllowed]: "^[A-Za-z0-9 \\s.-]*$",
  [regExTypes.carrierMessage]: "[\x09-~]+",
  [regExTypes.carrierFrom]: "[A-Za-z0-9\\s.\\-]+",
  [regExTypes.cvv]: "^[0-9]{3,4}$",
  [regExTypes.usZipCode]: "^[0-9]{5}(?:-[0-9]{4})?$",
  [regExTypes.quantity]: /(^[0-9]+$|^$)|Backspace|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Tab/,
  [regExTypes.onlyAlphabets]: "^[a-zA-Z]+$",
  [regExTypes.nospace]: "^\\S*$",
  [regExTypes.orderNumber]: "^[0-9]+(-[0-9]+)+$",
  // eslint-disable-next-line @stylistic/max-len
  [regExTypes.pobox]: /^\s*(.*((p|post)[-.\s]*(o|off|office)[-.\s]*(b|box|bin)[-.\s]*)|.*((p|post)[-.\s]*(o|off|office)[-.\s]*)|.*((p|post)[-.\s]*(b|box|bin)[-.\s]*)|(box|bin)[-.\s]*)(#|n|num|number)?\s*\d+/i,
  [regExTypes.expiry]: /^(0[1-9]|1[0-2])\/\d{4}$/gm,
  [regExTypes.emoji]: /\p{Emoji_Presentation}/gu
};
