import React from "react";
import links from "../../core/links.js";
import useScreen from "../../hooks/useScreen.js";

const Header = () => {
  const {handleScreenToggle} = useScreen();

  return <div className="relative wid100 height100p glass bg-header">
    <div className="flex row flex-center wid100 mflex-start">
      <div className="wid10 mwid20 align-center">
        <img src="images/my-pic.jpeg" className="logo"/>
      </div>
      <div className="mcol flex row align-center wid100 space-fill-100">
        <div className="wid100p mwid100 flex col space-fill-100 space-between">
          <div className="row space-between align-center mcol mleft">
            <span className="size30 msize24 bold">Devendra Prasad</span>
            <span className="size14 bold">Senior Staff Software Engineer</span>
          </div>
        </div>
        <div className="wid30 flex col right mleft mwid100">
          <span className="email">devendraprasad1984@gmail.com</span>
          <span className="phone">+91 958 279 7772</span>
          <div className="row gap2">
            <a className="hyperlink" href={links.cv} target="_blank">download
              CV</a>
            <a className="hyperlink" href={links.linkedIn}
               target="_blank">Linkedin</a>
          </div>
        </div>
      </div>
    </div>
    <div className="flex row flex-end">
      <button onClick={handleScreenToggle} className="rectangle-button button3 desktop-only">Toggle</button>
    </div>
  </div>;
};
export default Header;
