const core = {
  isPresent: (obj) => obj !== "" && obj !== undefined && obj !== null,
  coalesce: (a, b) => a ? a : b
};
export default core;
