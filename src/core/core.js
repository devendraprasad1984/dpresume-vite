const core = {
  isPresent: (obj) => obj !== "" && obj !== undefined && obj !== null,
  coalesce: (a, b) => a ? a : b,
  isObject: (val) => typeof val === "object" && val !== null
};
export default core;
