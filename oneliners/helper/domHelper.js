import core from "../core.js";
import vanillaSVGs from "./vanillaSVGs.js";

const pleaseWait = "Please wait...";
const domEnum = {
  loaderNode: "loader-node"
}

const getByDOMId = (domId) => {
  const dom = document.getElementById(domId);
  if (core.isPresent(dom)) {
    return dom;
  }
  return null;
};

const attachLoader = () => {
  const loaderNode = getByDOMId(domEnum.loaderNode);
  if (core.isPresent(loaderNode)) {
    loaderNode.innerHTML = `<div class="pad10 row gap1 align-center size16 bg-candy flex-center">
        <span>${vanillaSVGs.spinnerIcon("20px", "20px")}</span>
        <div class="bold text-danger">${pleaseWait}</div>
        </div>`;
    loaderNode.classList.remove("zero");
  }
}

const detachLoader = () => {
  const loaderNode = getByDOMId(domEnum.loaderNode);
  if (core.isPresent(loaderNode)) {
    loaderNode.innerHTML = ""
    loaderNode.classList.add("zero");
  }
}

const domHelper = {
  domEnum,
  getByDOMId,
  attachLoader,
  detachLoader
};
export default domHelper;
