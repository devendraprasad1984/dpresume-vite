import React from "react";
import FooterLinks from "./footerLinks.jsx";
import links from "../../core/links.js";
import Badges from "../contextual/badges.jsx";
import badges from "../../core/badges.js";

const colClass = "col pad5 space-fill-100 mgrid2x2";
const Footer = () => {
  return <div className="col gap5  glass pad20">
    <h2 className="bold">Work experience links</h2>
    <div className="row space-between gap5 mcol">
      <div className={colClass}>
        <FooterLinks linksArray={links.footer.section1}/>
      </div>
      <div className={colClass}>
        <FooterLinks linksArray={links.footer.section2}/>
      </div>
      <div className={colClass}>
        <FooterLinks linksArray={links.footer.section3}/>
      </div>
      <div className={colClass}>
        <FooterLinks linksArray={links.footer.section4}/>
      </div>
      <div className={colClass}>
        <h2 className="bold">Contact me</h2>
        <div className="email nowrap">devendraprasad1984@gmail.com</div>
        <div className="size14 phone nowrap">+91 958 279 7772</div>
      </div>
    </div>
    <div className="col gap1">
      <div className="row flex-wrap m-footer-badge">
        <strong>Learning: </strong> <Badges array={badges.learning}/></div>
      <div className="row flex-wrap m-footer-badge">
        <strong>Agile: </strong> <Badges array={badges.agile}/></div>
      <div className="row flex-wrap m-footer-badge">
        <strong>Hobbies: </strong> <Badges array={badges.hobbies}/></div>
    </div>
  </div>;
};
export default Footer;
