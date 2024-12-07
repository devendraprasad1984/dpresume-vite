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

//https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout
//delaying the execution of a function until a certain amount of time has passed since the last time it was called
const debounce = (mainFn, delay = 1000) => {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => mainFn(...args), delay)
  }
}

//Throttling is suitable for scenarios where you want to limit how often a function can be called, but you don’t want to miss any calls
//It is useful for improving the performance and responsiveness of web pages that have event listeners that trigger heavy or expensive operations, such as animations, scrolling, resizing, mousemove, fetching data, etc.
const throttling = (mainFn, delay = 1000) => {
  let timerId = null;
  return function (...args) {
    if (timerId !== null) {
      return;
    }
    mainFn(...args)
    timerId = setTimeout(() => {
      timerId = null;
    }, delay)
  }
}

const jsPackOfConcepts = {
  debounce,
  throttling
};
export default jsPackOfConcepts;