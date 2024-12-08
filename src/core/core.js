const isArray = (val) => Array.isArray(val);
const core = {
  isPresent: (obj) => obj !== "" && obj !== undefined && obj !== null,
  coalesce: (a, b) => a ? a : b,
  isObject: (val) => !isArray(val) && typeof val === "object" && val !== null,
  isArray: (val) => isArray(val)
};
export default core;
