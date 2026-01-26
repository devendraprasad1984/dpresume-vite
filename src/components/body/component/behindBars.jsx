import domHelper from "oneliners/helper/domHelper.js";
import {useState} from "react";

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
      <button className="btn" onClick={handleShowHide}>Open</button>
    </div>
    {showHide && <div className="col gap2">
      <div className="row gap2">
        <a className="text-primary" href="/docs/my_notes.txt" target="_blank">notes</a>
        <a className="text-primary" href="/docs/packOf30InterviewPrep.pdf" target="_blank">packOf30InterviewPrep</a>
        <a className="text-primary" href="/docs/large-scale-web-app.pdf" target="_blank">large-scale-web-app</a>
      </div>
      <div>
        <img src="/docs/lalaji_gyan.png" style={{
          width: "30rem",
          height: "auto"
        }} alt="gyan"/>
      </div>
    </div>
    }
  </div>;
};
export default BehindBars;