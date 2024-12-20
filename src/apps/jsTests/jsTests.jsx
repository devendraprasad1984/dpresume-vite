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

  return <div className="col flex-wrap gap1">
    <div id="outputContainer" className="outputDiv border pad10 overflow"></div>
    <div className="row gap1 flex-wrap">
      <button onClick={handleDebounce}>Debounce</button>
      <button onClick={handleThrottle}>Throttle</button>
      <button onClick={handleAddCurry}>Add Curry 3 args</button>
      <button onClick={handleAnnonymousCurry}>Annonymous curry</button>
      <button onClick={handleDeepArrayFlatten}>Deep flatten Array pollyfill</button>
      <button onClick={handleDeepObjectFlatten}>Deep flatten Object pollyfill</button>
      <button onClick={handleProxyObject}>Proxy Object</button>
      <button onClick={handlePipes}>Pipe operation</button>
    </div>
  </div>;
};
export default JsTests;
