import React from "react";
import jsHelper from "./jsHelper.js";
import domHelper from "../../core/domHelper.js";

const outputContainer = "outputContainer";
const getDOM = () => domHelper.getByDOMId(outputContainer);
const JsTests = () => {
  const handleDebounce = () => jsHelper.debounce(getDOM());
  const handleThrottle = () => jsHelper.throttle(getDOM());
  const handleAddCurry = () => jsHelper.addCurry(getDOM());
  const handleAnnonymousCurry = () => jsHelper.annonymousCurry(getDOM());
  const handleDeepArrayFlatten = () => jsHelper.flattenArrayTest(getDOM());
  const handleDeepObjectFlatten = () => jsHelper.flattenObjectTest(getDOM());
  const handleProxyObject = () => jsHelper.handleProxyObject(getDOM());
  const handlePipes = () => jsHelper.handlePipes(getDOM()).then(r => r).catch(r => r);
  const handleFetchAutoRetry = () => jsHelper.handleFetchAutoRetry(getDOM()).then(r => r).catch(r => r);
  const handlePromisePollyfill = () => jsHelper.handlePromisePollyfill(getDOM()).then(r => r).catch(r => r);

  return <div className="col flex-wrap gap1">
    <div id="outputContainer" className="outputDiv border pad10 overflow"></div>
    <div><span className="bold underline">Button variations</span></div>
    <div className="row gap1 flex-wrap button-push-container mgrid mgrid2x2">
      <button className="btn-red-light" onClick={handleDebounce}>Debounce</button>
      <button className="btn-green-light" onClick={handleThrottle}>Throttle</button>
      <button className="shadow__btn" onClick={handleAddCurry}>Add Curry 3 args</button>
      <button className="" onClick={handleAnnonymousCurry}><span>Annonymous curry</span></button>
      <button className="rectangle-button button2" onClick={handleDeepArrayFlatten}>Deep flatten Array pollyfill</button>
      <button className="rectangle-button button3" onClick={handleDeepObjectFlatten}>Deep flatten Object pollyfill</button>
      <button className="button-hover-red" onClick={handleProxyObject}>Proxy Object</button>
      <button className="button-hover-red" onClick={handlePipes}>Pipe operation</button>
      <button className="button-hover-red" onClick={handleFetchAutoRetry}>Fetch auto retry</button>
      <button className="button-hover-red btn-animated-line" onClick={handlePromisePollyfill}>
        <span></span><span></span><span></span><span></span>
        promise.all pollyfill
      </button>
    </div>
  </div>;
};
export default JsTests;
