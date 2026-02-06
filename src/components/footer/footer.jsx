import badges from "../../core/badges.js";
import links from "../../core/links.js";
import Badges from "../contextual/badges.jsx";
import FooterLinks from "./footerLinks.jsx";

const colClass = "col pad5 space-fill-100 mgrid2x2";
const Footer = () => {
  const signNumber = Math.floor(Math.random() * 10);
  const signImage = `/signs/dp_sign_${signNumber <= 0 ? 1 : signNumber}.png`;

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
    </div>

    <div className="col gap1">
      <div className="row flex-wrap m-footer-badge">
        <strong>Learning: </strong> <Badges array={badges.learning}/></div>
      <div className="row flex-wrap m-footer-badge">
        <strong>Agile: </strong> <Badges array={badges.agile}/></div>
      <div className="row flex-wrap m-footer-badge">
        <strong>Hobbies: </strong> <Badges array={badges.hobbies}/></div>
    </div>
    <div>
      <img src={signImage} className="sign"/>
    </div>
  </div>;
};
export default Footer;
