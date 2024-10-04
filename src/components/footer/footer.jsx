import React from "react";
import FooterLinks from "./footerLinks.jsx";
import links from "../../core/links.js";
import Badges from "../contextual/badges.jsx";
import badges from "../../core/badges.js";

const colClass = "col gap1 pad10 space-fill-100 min-col-wid200";
const Footer = () => {
  return <div className="col gap5  glass pad20">
    <div className="row space-between gap5 mcol">
      <div className={colClass}>
        <h2>Work experience links</h2>
        <FooterLinks linksArray={links.footer.section1}/>
      </div>
      <div className={colClass}>
        <FooterLinks linksArray={links.footer.section2}/>
      </div>
      <div className={colClass}>
        <FooterLinks linksArray={links.footer.section3}/>
      </div>
      <div className={colClass}>
        <h2>Project Demo Videos</h2>
        <FooterLinks linksArray={links.footer.section4}/>
      </div>
      <div className={colClass}>
        <h2>Contact me</h2>
        <div className="wt600 email">devendraprasad1984@gmail.com</div>
        <div className="wt600 size14 phone">+91 958 279 7772</div>
      </div>
    </div>
    <div className="col gap1">
      <div className="row">
        <p><strong>Learning: </strong> <Badges array={badges.learning}/>
        </p>
      </div>
      <div className="row"><p><strong>Agile: </strong> <Badges array={badges.agile}/>
      </p></div>
      <div><p><strong>Hobbies: </strong> <Badges array={badges.hobbies}/></p></div>
    </div>
  </div>;
};
export default Footer;
