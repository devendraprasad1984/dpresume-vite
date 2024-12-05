import React from "react";
import FooterLinks from "./footerLinks.jsx";
import links from "../../core/links.js";
import Badges from "../contextual/badges.jsx";
import badges from "../../core/badges.js";

const colClass = "col gap1 pad10 space-fill-100";
const Footer = () => {
  return <div className="col gap5  glass pad20">
    <div className="row space-between gap5 mcol">
      <div className={colClass}>
        <h2 className="bold">Work experience links</h2>
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
        <h2 className="bold">Contact me</h2>
        <div className="email nowrap">devendraprasad1984@gmail.com</div>
        <div className="size14 phone nowrap">+91 958 279 7772</div>
      </div>
    </div>
    <div className="col gap1">
      <div className="row gap2"><strong>Learning: </strong> <Badges array={badges.learning}/></div>
      <div className="row gap2"><strong>Agile: </strong> <Badges array={badges.agile}/></div>
      <div className="row gap2"><strong>Hobbies: </strong> <Badges array={badges.hobbies}/></div>
    </div>
  </div>;
};
export default Footer;
