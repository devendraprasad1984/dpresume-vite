import REQUEST_SOURCE from "../enums/requestSource.js";
import contentPaths from "../site-level/contentPaths.js";
import {urlChecker} from "./utils/urlChecker.js";
import {UNDERSCORE, UNDERSCORE_TUPLE} from "../const/const.js";
import {dateTimeHelper} from "./utils/dateTimeHelper.js";
import {colorHelper} from "./utils/colorHelper.js";

function getCryptoRandomId() {
  return crypto.randomUUID();
}

function getCryptoId() {
  return getCryptoRandomId() + UNDERSCORE_TUPLE
    + dateTimeHelper.dateConvertToISOUnixTime(new Date());
}

function getNonCryptoId() {
  return (new Date().toLocaleDateString()
    + colorHelper.generateRandomHexColor() + UNDERSCORE_TUPLE
    + dateTimeHelper.dateConvertToISOUnixTime(new Date())).replaceChars(
    contentPaths.getDelimiter(), UNDERSCORE).replaceChars("#",
    UNDERSCORE_TUPLE);
}

// the prefix here is referenced by orchestrator, for security purpose
// please do not change without corresponding change in orchestrator
const correlationIdSystemEnum = {
  andor: REQUEST_SOURCE.ANDOR + UNDERSCORE_TUPLE,
  legacy: REQUEST_SOURCE.LEGACY + UNDERSCORE_TUPLE,
  storybook: REQUEST_SOURCE.ANDOR + UNDERSCORE_TUPLE + REQUEST_SOURCE.STORYBOOK
    + UNDERSCORE_TUPLE
};

const getSystemPrefix = () => {
  if (urlChecker.isStorybookMode()) {
    return correlationIdSystemEnum.storybook;
  }
  if (urlChecker.isRunningInIframe()) {
    return correlationIdSystemEnum.legacy;
  }
  return correlationIdSystemEnum.andor;
};

const getCorrelationID = () => {
  let correlationId = getSystemPrefix() + "corr-id-" + getNonCryptoId();
  if (crypto) {
    correlationId = getSystemPrefix() + getCryptoId();
  }
  return correlationId;
};

const getRandomId = (limit = 12) => {
  let id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  if (crypto) {
    id = getCryptoRandomId();
  }
  if (limit) {
    return id.slice(0, limit);
  }
  return id;
};

const getDOMID = () => !crypto
  ? "dom-" + getNonCryptoId()
  : getCryptoId();

const cryptoHelper = {
  getCorrelationID,
  getRandomId,
  getDOMID
};

export default cryptoHelper;
