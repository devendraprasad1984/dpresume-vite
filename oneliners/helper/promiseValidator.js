//https://www.geeksforgeeks.org/global-error-handler-not-catching-unhandled-promise-rejection/
const globalPromiseRejectionHandler = (event, log = false) => {
  event.preventDefault();
  callback && log === true && callback("Unhandled promise rejection reason " + event?.reason);
};

const setupCatchForScriptError = (callback) => {
  window.onerror = function (message, source, lineno, colno, error) {
    const scriptError = "script error: " + message + ", " + window.onerror + ", source: " + source + ", line: " + lineno + ", col: " + colno;
    callback && callback(scriptError);
  };
};

export const setUnhandledPromiseGlobalCatch = () => {
  window.onunhandledrejection = globalPromiseRejectionHandler;
  setupCatchForScriptError();
};
