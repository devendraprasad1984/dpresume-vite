import jsPackOfConcepts from "../../practice/jsPackOfConcepts.js";

const oneSecond = 1000;
let debounceCounter = 0;
const printTitle = (title) => {
  return `<b class="size20 underline text-primary">${title}</b><br/>`;
};
const printLine = () => {
  return "<br/> ==============================<br/>";
};
const pleaseWait = (ref) => ref.innerHTML = "Please wait..." + debounceCounter;
const debounce = (ref) => {
  debounceCounter++;
  pleaseWait(ref);
  jsPackOfConcepts.debounce(() => {
    ref.innerHTML = printTitle("Debounce") + "delaying the execution of a function until a certain amount of time has passed since the last time it was called";
  }, oneSecond)();
};

const throttle = (ref) => {
  debounceCounter++;
  let prev = Date.now();
  pleaseWait(ref);
  jsPackOfConcepts.throttling(() => {
    ref.innerHTML = printTitle("Throttling") + debounceCounter
      + " - Throttling is suitable for scenarios where you want to limit how often a function can be called, don’t miss any execution. improving the performance, responsiveness of web pages that have event listeners that trigger heavy or expensive operations, eg animations, scrolling, resizing, mousemove, fetching data | "
      + (Date.now() - prev).toString();
    prev = Date.now();
  }, oneSecond)();
};

const addCurry = (ref) => {
  ref.innerHTML = printTitle("Simple curry") + "SIMPLE CURRY: sum of 10,20,30 is: " + jsPackOfConcepts.simpleAddCurry(10)(20)(
    30);
};
const logme = (importance, message) => {
  const date = new Date();
  const logit = `(${importance}: ${date.toLocaleDateString()} ${date.toLocaleTimeString()})==> ${message}`;
  console.log(logit);
  return logit;
};
const annonymousCurry = (ref) => {
  const log = jsPackOfConcepts.logger();
  log("print");
  log("hello world");
  const sumof3 = jsPackOfConcepts.annonymousCurry((a, b, c) => a + b + c);
  const mulOf4 = jsPackOfConcepts.annonymousCurry((a, b, c, d) => a * b * c * d);
  const curryLog = jsPackOfConcepts.annonymousCurry(logme);
  const placeholder = "_";
  const concat3Strings = jsPackOfConcepts.curryWithPlaceholder((a, b, c) => `${a}$ ${b}$ ${c}`, placeholder);
  const concatHello = concat3Strings("Hello", placeholder, "Greeting");
  const concatWonder = concat3Strings("Wondering", placeholder, "Land");
  const severe = curryLog("SEVERE");
  const warn = curryLog("WARN");
  ref.innerHTML = printTitle("Annonymous curry") + "sum of 3 (10)(20)(30) is: " + sumof3(10)(20)(30);
  ref.innerHTML += "<br/>sum of (10)(20,30) is: " + sumof3(10)(20, 30);
  ref.innerHTML += "<br/>multiply of (10,40)(20,30) is: " + mulOf4(10, 40)(20, 30);
  ref.innerHTML += "<br/> CURRIED LOGGING ";
  ref.innerHTML += printLine();
  ref.innerHTML += "<br/> Severe1 " + severe("MAYDAY MAYDAY MAYDAY");
  ref.innerHTML += "<br/> Server2 " + severe("HELP HELP");
  ref.innerHTML += "<br/> Warn1 " + warn("Warning1");
  ref.innerHTML += "<br/> Warn2 " + warn("Alarm1");
  ref.innerHTML += printLine();
  ref.innerHTML += "<br/> Currying with placeholder argument";
  ref.innerHTML += `<br/> ${concatHello("world!")}`;
  ref.innerHTML += `<br/> ${concatWonder("how to")}`;
  log("ok");
};

const flattenArrayTest = (ref) => {
  const arr1 = [1, [2], [3, [4]]];
  const arr2 = [1, 2, [3, 4, [5, 6]]];
  ref.innerHTML = printTitle("flattenArrayTest") + "arr1=[1, [2], [3, [4]]], arr2=[1, 2, [3, 4, [5, 6]]]";
  ref.innerHTML += printLine() + jsPackOfConcepts.deepFlattenArray(arr1, 1);
  ref.innerHTML += printLine() + jsPackOfConcepts.deepFlattenArray(arr1, 2);
  ref.innerHTML += printLine() + jsPackOfConcepts.deepFlattenArray(arr2, 2);
};

const flattenObjectTest = (ref) => {
  const obj1 = {
    a: 1,
    b: 2,
    c: {
      d: 3,
      e: 4
    }
  };
  const obj2 = {
    a: 1,
    b: 2,
    c: {
      d: {
        a1: "1",
        a2: "2",
        a3: null
      },
      e: {
        f: "2",
        g: {
          x: "hello",
          y: [1, 2, 4, 3]
        }
      }
    }
  };
  ref.innerHTML = printTitle("flattenObjectTest") + `obj1=${JSON.stringify(obj1)}` + printLine();
  ref.innerHTML += JSON.stringify(jsPackOfConcepts.deepFlattenObject(obj1)) + printLine();
  ref.innerHTML += `obj2=${JSON.stringify(obj2)}` + printLine();
  ref.innerHTML += JSON.stringify(jsPackOfConcepts.deepFlattenObject(obj2));
};

const jsHelper = {
  debounce,
  throttle,
  addCurry,
  annonymousCurry,
  flattenArrayTest,
  flattenObjectTest
};
export default jsHelper;