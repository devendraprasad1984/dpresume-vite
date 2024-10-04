import React from "react";
import FooterLinks from "./footerLinks.jsx";
import links from "../../core/links.js";

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
      </div>
      <div className={colClass}>
      </div>
      <div className={colClass}>
        <h2>Contact me</h2>
        <div className="wt600 email">devendraprasad1984@gmail.com</div>
        <div className="wt600 size14 phone">+91 958 279 7772</div>
      </div>
    </div>
    <div className="">
      <div className="row">
        <p><strong>Learning: </strong> devops, graphql, UI design system, Web3, FE architecture and system design, node
        </p>
      </div>
      <div className="row"><p><strong>Agile</strong>: Agile Planning | Estimation | Sprint | Retro | Review | Speedback
      </p></div>
      <div><p><strong>Hobbies</strong>: upskilling | music | movies</p></div>
    </div>
  </div>;
};
export default Footer;
