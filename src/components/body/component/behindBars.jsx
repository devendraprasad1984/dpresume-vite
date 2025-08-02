import React, { useState } from "react";
import domHelper from "oneliners/helper/domHelper.js";

const BehindBars = () => {
  const [showHide, setShowHide] = useState(false);
  const passPhrase = "dpmeradp";
  const handleShowHide = () => {
    if (domHelper.getByDOMId("passphrase").value === passPhrase) {
      setShowHide(true);
    }
  };
  return <div>
    <div className="row gap5 bg-light pad5">
      <input id="passphrase" type="password" placeholder="enter passphrase" className="wid70"/>
      <button className="wid30 btn btn-animated-line text-success" onClick={handleShowHide}>
        <span></span><span></span><span></span><span></span>
        <span className="text-success bold">Khul jaa sim sim</span>
      </button>
    </div>
    {showHide && <div className="row grid">
      <a className="text-primary" href="/docs/my_notes.txt" target="_blank">notes</a>
    </div>}
  </div>;
};
export default BehindBars;