import jsPackOfConcepts from "../../practice/jsPackOfConcepts.js";
import oneliners from "oneliners";

const core = oneliners.core;
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
  const concat3Strings = jsPackOfConcepts.curryWithPlaceholder((a, b, c) => `${a} ${b} ${c}`, placeholder);
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
  ref.innerHTML = printTitle("flattenObjectTest") + `obj1=${core.stringify(obj1)}` + printLine();
  ref.innerHTML += core.stringify(jsPackOfConcepts.deepFlattenObject(obj1)) + printLine();
  ref.innerHTML += `obj2=${core.stringify(obj2)}` + printLine();
  ref.innerHTML += core.stringify(jsPackOfConcepts.deepFlattenObject(obj2));
};

const handleProxyObject = (ref) => {
  const obj1 = {
    userName: "DP",
    password: "dpdpdp",
    age: 40
  };
  const proxy = new Proxy(obj1, {
    get(target, prop) {
      if (prop === "password") {
        return "sensitive data";
      }
      return target[prop];
    }
  });
  const person = new function () {
    return {
      ...obj1,
      speak: (name) => {
        return `${name} is speaking`;
      }
    };
  };
  const origArr = [1, 2, 3, 4, 5];
  const arr = jsPackOfConcepts.proxyArray(origArr);
  ref.innerHTML = printTitle("handleProxyObject") + `normal read: obj1=${core.stringify(obj1)}` + printLine();
  ref.innerHTML += `proxy read: username: ${proxy.userName}, password: ${proxy.password}, age: ${proxy.age}` + printLine();
  ref.innerHTML += `via person class read: username: ${person.userName}, password: ${person.password}, age: ${person.age}, speek: ${person.speak("Ram")}` + printLine();
  ref.innerHTML += `proxy array reverse read: ${core.getValues(arr)}, -1: ${arr[-1]}` + printLine();
  console.log("arr", origArr, "proxy", arr);
};

const handlePipes = async (ref) => {
  const getName = (input) => input.name;
  const getUppercaseName = (input) => input.toUpperCase();
  const getUppercaseNameAsync = (input) => {
    return new Promise(resolve => setTimeout(() =>
      resolve(input.toUpperCase()), 3000));
  };
  const getFirstName = (input) => input.split(" ")[0];
  const getReversedName = (input) => input.split("").reverse().join("");
  const pipeSyncFor = jsPackOfConcepts.pipeViaForLoop(getName, getUppercaseName, getFirstName, getReversedName);
  const pipeSyncReduce = jsPackOfConcepts.pipeViaReduce(getName, getUppercaseName, getFirstName, getReversedName);
  const pipeAsyncReduce = jsPackOfConcepts.pipeViaReduce(getName, getUppercaseNameAsync, getFirstName, getReversedName);

  const name1 = "Devendra Prasad";
  const name2 = "Dhanajay Jha";
  const name3 = "Aayush Saxena";
  const outputFromForPipe = await pipeSyncFor({name: name1});
  ref.innerHTML = printTitle("handlePipes") + `sync read: ${name1} -  ${outputFromForPipe}` + printLine();

  const outputFromReducePipe = await pipeSyncReduce({name: name2});
  ref.innerHTML += `sync read: ${name2} -${outputFromReducePipe}` + printLine();

  const outputFromReducePipeAsync = await pipeAsyncReduce({name: name3});
  ref.innerHTML += `Async read: ${name3} -${outputFromReducePipeAsync}` + printLine();
};

const handleFetchAutoRetry = async (ref) => {
  const url = "https://jsonplaceholder.typicode.com/todos";
  const fetchIt = () => jsPackOfConcepts.fetchApi(url);
  ref.innerHTML = pleaseWait(ref);
  const response = await jsPackOfConcepts.fetchAutoRetry(fetchIt);
  // response.then(data => console.log("data", data)).catch(e => console.log(e));
  // const data = await response;
  ref.innerHTML = printTitle("handleFetchAutoRetry") + `todos data: ${url} => ${core.stringify(response.slice(0, 10))}` + printLine();
};

const handlePromisePollyfill = async (ref) => {
  ref.innerHTML = pleaseWait(ref);
  const promise1 = jsPackOfConcepts.promiseAll([
    Promise.resolve(1),
    new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
    4,
    Promise.resolve(3),
  ]);
  let result1 = await promise1;
  ref.innerHTML = printTitle("handlePromisePollyfill") + `promise.all: ${result1}` + printLine();
};

const jsHelper = {
  debounce,
  throttle,
  addCurry,
  annonymousCurry,
  flattenArrayTest,
  flattenObjectTest,
  handleProxyObject,
  handlePipes,
  handleFetchAutoRetry,
  handlePromisePollyfill
};
export default jsHelper;