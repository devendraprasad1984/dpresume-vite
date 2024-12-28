import pdpEnum from "../enums/pdpEnum.js";
import checkoutEnum from "../enums/checkoutEnum.js";
import { formattedValues } from "../core/utils/formattedValues.js";
import { core } from "../core/core.js";
import site from "../core/utils/siteConfig.js";
import { numberHelper } from "../core/utils/numberHelper.js";
import coreMeta from "../core/coreMeta.js";
import { validatorRegExTypes, validatorsObj } from "./validators.js";
import {
  firstNameLength,
  lastNameLength,
  maxEmailCharLength,
  maxEmbossMessageLength,
  maxEmbossNameLength,
  maxEmbossNameLengthOl,
  maxMessageLength,
  maxPostCodeLength,
  maxPromoCodeLength
} from "./numericConsts.js";
import { isOFACEmail } from "./checkOFACPatterns.js";

const maxNameLength = firstNameLength + lastNameLength;
const attributePresenceFailed = (name) => {
  return !core.isPresent(name);
};

const nameValidationRegExFailed = (name) => {
  return !validatorsObj[validatorRegExTypes.noSpecialCharactersButHyphenAllowed](
    name);
};

const embossNameValidationFailed = (fullName) => {
  return core.anyTrue([attributePresenceFailed(fullName),
    !validatorsObj[validatorRegExTypes.noSpecialCharactersButHyphenAllowed](
      fullName),
    (fullName.length > maxEmbossNameLength)]);
};

const embossNameOnCardValidationFailed = (fullName) => {
  return core.anyTrue([attributePresenceFailed(fullName),
    !validatorsObj[validatorRegExTypes.noSpecialCharactersButHyphenAllowed](
      fullName),
    (fullName.length > maxEmbossNameLength)]);
};

const promoCodeValidationFailed = (code) => {
  return core.anyTrue(
    !validatorsObj[validatorRegExTypes.noSpecialCharactersButHyphenAllowed](
      code),
    (code.length > maxPromoCodeLength));
};

const fullNameValidationFailed = (fullName) => {
  //allow upto 2 space (to accommodate middle name too)
  return core.anyTrue(
    [attributePresenceFailed(fullName),
      !validatorsObj[validatorRegExTypes.mustContainSpace](fullName),
      (fullName.length > maxNameLength + 1)
    ]);
};

const senderNameValidationFailed = (senderName) => {
  return core.anyTrue(
    [attributePresenceFailed(senderName),
      (senderName.length > maxEmbossNameLengthOl)
    ]);
};

const firstOrLastNameValidationFailed = (name) => {
  return core.anyTrue(
    [attributePresenceFailed(name), (name.length > (maxNameLength / 2))]);
};

const emailValidationFailed = (email) => {
  return core.anyTrue(
    [!core.isPresent(email), (email?.length > maxEmailCharLength),
      isOFACEmail(email)]);
};

const emailValidationRegExFailed = (email) => {
  return !validatorsObj[validatorRegExTypes.email](email);
};

const postalCodeValidationFailed = (postalCode) => {
  return core.anyTrue(
    [postalCode?.length > 0 && Number.isNaN(postalCode),
      !core.isPresent(postalCode),
      postalCode?.length > maxPostCodeLength]);
};

const phoneNumberValidationFailed = (phoneNumber) => {
  const updatedPhoneNumber = coreMeta.phoneNumberOnly(phoneNumber);
  return core.anyTrue([
    updatedPhoneNumber?.length > 0 && Number.isNaN(updatedPhoneNumber),
    !core.isPresent(updatedPhoneNumber),
    updatedPhoneNumber?.length < site.getPhoneMinLength(),
    updatedPhoneNumber?.length > site.getPhoneMaxLength(),
    coreMeta.isPhoneNumberPrefixInvalid(updatedPhoneNumber)
  ]);
};

const taxFeinValidationFailed = (value) => {
  const number = formattedValues.getNativeValue(value);
  return core.ifTrue(
    number?.length !== numberHelper.getTaxFeinDigitsNumber());
};

const giftMessageValidationFailed = (giftMessage) => {
  return core.anyTrue(giftMessage?.length > maxMessageLength);
};

const embossMessageValidationFailed = (cardMessage) => {
  return core.anyTrue(
    !validatorsObj[validatorRegExTypes.noSpecialCharactersButHyphenAllowed](
      cardMessage),
    cardMessage?.length > maxEmbossMessageLength);
};

export const validateInlineField = (name, value) => {
  const trimmedValue = core.nullSafeTrim(value);
  switch (name) {
    case pdpEnum.name:
      return {
        isFailed: fullNameValidationFailed(trimmedValue),
        isRegExFailed: nameValidationRegExFailed(trimmedValue)
      };
    case checkoutEnum.senderName:
      return {
        isFailed: senderNameValidationFailed(trimmedValue),
        isRegExFailed: nameValidationRegExFailed(trimmedValue)
      };
    case checkoutEnum.firstName:
    case checkoutEnum.lastName:
    case checkoutEnum.senderFirstName:
    case checkoutEnum.senderLastName:
      return {
        isFailed: firstOrLastNameValidationFailed(trimmedValue),
        isRegExFailed: nameValidationRegExFailed(trimmedValue)
      };
    case checkoutEnum.city:
    case checkoutEnum.state:
      return {
        isFailed: attributePresenceFailed(trimmedValue),
        isRegExFailed: nameValidationRegExFailed(trimmedValue)
      };
    case checkoutEnum.promoCode:
      return {
        isFailed: attributePresenceFailed(trimmedValue),
        isRegExFailed: promoCodeValidationFailed(trimmedValue)
      };
    case checkoutEnum.street:
      return {
        isFailed: !core.isPresent(trimmedValue),
        isRegExFailed: false
      };
    case checkoutEnum.email:
    case checkoutEnum.emailSender:
      return {
        isFailed: emailValidationFailed(trimmedValue),
        isRegExFailed: emailValidationRegExFailed(trimmedValue)
      };
    case checkoutEnum.phone:
      return {
        isFailed: phoneNumberValidationFailed(trimmedValue),
        isRegExFailed: false
      };
    case checkoutEnum.taxFein:
      return {
        isFailed: taxFeinValidationFailed(trimmedValue),
        isRegExFailed: false
      };
    case checkoutEnum.message:
      return {
        isFailed: giftMessageValidationFailed(trimmedValue),
        isRegExFailed: false
      };
    case checkoutEnum.postcode:
      return {
        isFailed: postalCodeValidationFailed(trimmedValue),
        isRegExFailed: false
      };
    case checkoutEnum.nameOnCard:
      return {
        isFailed: embossNameValidationFailed(trimmedValue),
        isRegExFailed: false
      };
    case checkoutEnum.embossNameOnCard:
      return {
        isFailed: embossNameOnCardValidationFailed(trimmedValue),
        isRegExFailed: false
      };
    case checkoutEnum.messageOnCard:
      return {
        isFailed: embossMessageValidationFailed(trimmedValue),
        isRegExFailed: false
      };
    default:
      return {
        isFailed: false,
        isRegExFailed: false
      };
  }
};

