import React from "react";
import jsHelper from "./jsHelper.js";
import domHelper from "../../core/domHelper.js";

const outputContainer = "outputContainer";
const getDOM = () => domHelper.getByDOMId(outputContainer)
const JsTests = () => {
  const handleDebounce = () => jsHelper.debounce(getDOM());

  return <div className="col flex-wrap gap1">
    <div id="outputContainer" className="outputDiv border pad10 overflow"></div>
    <div className="row gap1 flex-wrap">
      <button onClick={handleDebounce}>Debounce</button>
    </div>
  </div>
};
export default JsTests;
