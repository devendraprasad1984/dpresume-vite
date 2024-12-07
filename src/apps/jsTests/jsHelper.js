import JsPackOf30 from "../../practice/jsPackOf30.js";

const oneSecond = 1000;
let debounceCounter = 0;
const pleaseWait = (ref) => ref.innerHTML = "Please wait..." + debounceCounter
const debounce = (ref) => {
  debounceCounter++;
  pleaseWait(ref);
  JsPackOf30.debounce(() => {
    ref.innerHTML = "delaying the execution of a function until a certain amount of time has passed since the last time it was called"
  }, oneSecond)()
}

const throttle = (ref) => {
  debounceCounter++;
  pleaseWait(ref);
  JsPackOf30.throttling(() => {
    ref.innerHTML = debounceCounter
      + " - Throttling is suitable for scenarios where you want to limit how often a function can be called, but you don’t want to miss any calls. It is useful for improving the performance and responsiveness of web pages that have event listeners that trigger heavy or expensive operations, such as animations, scrolling, resizing, mousemove, fetching data, etc."
  }, oneSecond)()
}

const jsHelper = {
  debounce,
  throttle
};
export default jsHelper;