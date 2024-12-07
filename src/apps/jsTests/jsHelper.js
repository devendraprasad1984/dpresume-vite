import jsPackOfConcepts from "../../practice/jsPackOfConcepts.js";

const oneSecond = 1000;
let debounceCounter = 0;
const pleaseWait = (ref) => ref.innerHTML = "Please wait..." + debounceCounter
const debounce = (ref) => {
  debounceCounter++;
  pleaseWait(ref);
  jsPackOfConcepts.debounce(() => {
    ref.innerHTML = "delaying the execution of a function until a certain amount of time has passed since the last time it was called"
  }, oneSecond)()
}

const throttle = (ref) => {
  debounceCounter++;
  let prev = Date.now();
  pleaseWait(ref);
  jsPackOfConcepts.throttling(() => {
    ref.innerHTML = debounceCounter
      + " - Throttling is suitable for scenarios where you want to limit how often a function can be called, don’t miss any execution. improving the performance, responsiveness of web pages that have event listeners that trigger heavy or expensive operations, eg animations, scrolling, resizing, mousemove, fetching data | "
      + (Date.now() - prev).toString()
    prev = Date.now()
  }, oneSecond)()
}

//Currying doesn’t call a function. It just transforms it.
const curry = () => {
}

const jsHelper = {
  debounce, throttle, curry
};
export default jsHelper;