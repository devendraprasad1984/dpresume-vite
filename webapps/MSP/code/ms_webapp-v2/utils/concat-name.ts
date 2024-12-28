/**
 * Generate concatenated name
 */

const concatName = (strings: string[], separator = " ") => {
  return strings?.filter((item) => !!item)?.join(separator);
};

export default concatName;
