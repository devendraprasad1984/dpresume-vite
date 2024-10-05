import core from "./core.js";

const getByDOMId = (domId) => {
  const dom = document.getElementById(domId);
  if (core.isPresent(dom)) {
    return dom;
  }
  return null;
};

const domHelper = {
  getByDOMId
};
export default domHelper;
