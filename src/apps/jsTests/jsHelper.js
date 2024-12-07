import JsPackOf30 from "../../practice/jsPackOf30.js";

const oneSecond = 1000;
const pleaseWait = (ref) => ref.innerHTML = "Please wait..."
const debounce = (ref) => {
  pleaseWait(ref);
  JsPackOf30.debounce(() => {
    ref.innerHTML = "Hello World"
  }, oneSecond)()
}

const jsHelper = {
  debounce
};
export default jsHelper;