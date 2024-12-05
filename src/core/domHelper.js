import core from "./core.js";

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
    loaderNode.innerHTML = `<div class="bold text-danger bg-candy pad10">${pleaseWait}</div>`
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
