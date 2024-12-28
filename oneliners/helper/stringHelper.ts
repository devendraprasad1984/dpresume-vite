/**
 * This is a concept file for now, to consider closure-functions approach vs. prototypes.
 * Please refer: project root -> docs/ui-ux/ConceptReconciliations.md
 */
import { core } from "./core.js";

function replaceChars(value: string, char1: string, char2: string) {
  const newValue = core.nullSafeString(value).replaceAll(char1, char2);
  return {
    replaceChars: (char11: string, char22: string) => {
      return replaceChars(newValue, char11, char22);
    },
    get value() {
      return newValue;
    }
  };
}

function nopx(value: string) {
  return core.nullSafeString(value).replace("px", "");
}

const stringHelper = {
  replaceChars,
  nopx
};

export default stringHelper;
