import React from "react";
import links from "../../core/links.js";

const Header = () => {
  return <div className="relative wid100 height100p glass">
    <div className="flex row space-between wid100 top">
      <div className="wid10 pad10 mwid20">
        <img src="images/my-pic.jpeg" className="logo"/>
      </div>
      <div className="mcol flex row space-between wid100 space-fill-100">
        <div className="wid100p mwid100p flex col flex-start space-fill-100">
          <span className="size38 msize30">Devendra Prasad</span>
          <span>Senior Staff Software Engineer</span>
        </div>
        <div className="wid30 flex col right mleft mwid100p">
          <span className="email">devendraprasad1984@gmail.com</span>
          <span className="phone">+91 958 279 7772</span>
          <div className="row gap2">
            <a className="hyperlink" href={links.linkedIn} target="_blank">Linkedin</a>
            <a className="hyperlink" href={links.cv} target="_blank">download CV</a>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default Header;
