/**
 * =>implement a function that serialises a function values into JSON string
 * =>implement a function that handles deep copy also handles circular references
 * =>implement a function that serialises if two objects are deep equal
 * =>implement the function behaviour of promies.any
 * =>implement the function behaviour of promies.allSettled
 * =>implement a function that returns the memoised version of a function that accepts a single value
 * =>implement a function that deserialises a JSON string into a value
 * =>implement a class that can subscribe to and emit events that trigger attached callback functions
 * =>implement a debounce function that comes with cancel method which can cancel delayed invocation
 * =>implement a method that recursively flattens the array into a single level deep
 * =>implement a function to execute N async tasks in a series
 * =>implement a function to execute N async tasks in a parallel
 * =>implement a function to execute N async tasks in a race
 * =>implement a pipe function which chains N number of functions
 * =>implement negative indexing in an array using proxies
 * =>implement lodash_.get method pollyfill which get a value from the path
 * =>implement custom method of "call" which sets "this" context
 * =>implement throttling of promies which throlles api requests to max limit
 * =>implement memoizing or caching identical api requests
 * =>implement curried function with placeholders support
 * =>implement custom pollyfill of object.assign
 * =>implement a custom virtual DOM which serialises data into valid javascript object
 * =>implement a custom virtual DOM which deserialises data
 * =>implement a custom pollyfill for memoize function
 * =>implement a custom string tokeniser
 * =>implement a custom function that chunks the array
 * =>implement the pollyfill for call, apply, bind from scratch
 * =>implement throttle method that comes with cancel method which can cancel delayed invocation
 * =>implement custom pollyfill for typeof operation
 */
import core from "../core/core.js";

//https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout
//delaying the execution of a function until a certain amount of time has passed since the last time it was called
const debounce = (mainFn, delay = 1000) => {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => mainFn(...args), delay);
  };
};

//Throttling is suitable for scenarios where you want to limit how often a function can be called, but you don’t want to miss any calls
//It is useful for improving the performance and responsiveness of web pages that have event listeners that trigger heavy or expensive operations, such as animations, scrolling, resizing, mousemove, fetching data, etc.
const throttling = (mainFn, delay = 1000) => {
  let timerId = null;
  return function (...args) {
    if (timerId !== null) {
      return;
    }
    mainFn(...args);
    timerId = setTimeout(() => {
      timerId = null;
    }, delay);
  };
};

//Currying doesn’t call a function. It just transforms it.
//it is a technique which transforms a callable function from f(a, b, c) into sequences of callable functions like f(a)(b)(c) or f(a,b)(c) or f(a)(b,c)
//helpful in situation eg logging, generating reusable, modern code
const simpleAddCurry = (a) => (b) => (c) => a + b + c;
const annonymousCurry = (mainFunction) => {
  return function curried(...args) {
    if (args.length >= mainFunction.length) {
      return mainFunction(...args);
    } else {
      return curried.bind(null, ...args);
    }
  };
};

//Placeholders act as markers that reserve positions for arguments, enabling partial application and more flexible function composition
//It enhances code readability and promotes composability by enabling functions to be composed dynamically with missing arguments
const curryWithPlaceholder = (fn, placeholder = "_") => {
  return function curried(...args) {
    const hasPlaceholder = args.indexOf(placeholder) !== -1;
    if (args.length >= fn.length && !hasPlaceholder) {
      return fn.apply(this, args);
    } else {
      //return curried with placeholder support
      return function (...nextArgs) {
        const combinedArgs = args.map(arg => arg === placeholder && nextArgs.length ? nextArgs.shift() : arg).concat(nextArgs);
        return curried(...combinedArgs);
      };
    }
  };
};

const logger = () => {
  let count = 0;
  return (value) => console.log(`output is ${count++}`, value);
};

//its a pollyfill for Array.prototype.flat with a depth given, default to 1
const deepFlattenArray = (arr, depth) => {
  const result = [];
  const stack = [];
  const newArr = arr.map(ar => [ar, depth]);
  stack.push(...newArr);
  while (stack.length > 0) {
    const pop = stack.pop();
    const [ar, depth] = pop;
    if (depth === 0) {
      result.push(ar);
      continue;
    }
    if (!core.isArray(ar)) {
      result.push(ar);
    } else {
      const newArr = ar.map(el => [el, depth - 1]);
      stack.push(...newArr);
    }
  }
  return result.reverse();
};

const deepFlattenObject = (inputObject) => {
  let result = {};
  for (let key in inputObject) {
    const elem = inputObject[key];
    if (core.isArray(elem)) {
      result[key] = deepFlattenArray(elem);
    } else if (core.isObject(inputObject[key])) {
      const recResult = deepFlattenObject(elem);
      result = {...result, ...recResult};
    } else {
      result[key] = elem;
    }
  }
  return result;
};

const proxyArray = (arr) => {
  //get/set is called a trap, other traps are: get, set, getPrototypeOf, setPrototypeOf, isExtensible, preventExtensions, getOwnPropertyDescriptor, defineProperty
  //has, deleteProperty, ownKeys, apply, construct
  return new Proxy(arr, {
    get(target, property) {
      const index = Number(property);
      return index < 0 ? target[target.length + index] : target[index];
    },
    set(target, property, value) {
      let index = Number(property);
      if (index < 0) {
        index += target.length;
        if (index < 0) {
          throw new Error("cannot set to negative index");
        }
        target[index] = value;
        return true; //as pattern, this signals proxy to have successful write operation done
      }
      target[index] = value;
      return true;
    }
  });
};

const pipeViaForLoop = (...listOfFunctions) => {
  return function (initArg) {
    let result = initArg;
    for (let fn of listOfFunctions) {
      result = fn(result);
    }
    return Promise.resolve(result);
  };
};

function pipeViaReduce(...listOfFunctions) {
  return function (initArg) {
    return listOfFunctions.reduce((chain, fn) => {
      return chain.then(result => fn(result));
    }, Promise.resolve(initArg));
  };
}

const fetchApi = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
};
const fetchAutoRetry = (fetchFn, retryLimit = 3) => {
  return new Promise(function (resolve, reject) {
    //iife call
    (function retry() {
      fetchFn().then((data) => {
        resolve(data);
      }).catch((err) => {
        if (retryLimit-- > 0) {
          retry();
        } else {
          reject(err);
        }
      });
    })();
  });
};

//pollyfill for Promise.all
const promiseAll = (input) => {
  const result = [];
  let resolvedCount = 0;
  return new Promise((resolve, reject) => {
    //loop over each param and wrap in resolve
    for (let index in input) {
      const elem = input[index];
      Promise.resolve(elem).then(value => {
        result[index] = value;
        resolvedCount += 1;
        if (resolvedCount === input.length) {
          resolve(result);
        }
      }).catch(err => reject(err));
    }
  });
};

const jsPackOfConcepts = {
  debounce,
  throttling,
  simpleAddCurry,
  annonymousCurry,
  logger,
  curryWithPlaceholder,
  deepFlattenArray,
  deepFlattenObject,
  proxyArray,
  pipeViaForLoop,
  pipeViaReduce,
  fetchApi,
  fetchAutoRetry,
  promiseAll
};
export default jsPackOfConcepts;