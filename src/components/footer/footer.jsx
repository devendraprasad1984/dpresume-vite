import badges from "../../core/badges.js";
import links from "../../core/links.js";
import Badges from "../contextual/badges.jsx";
import FooterLinks from "./footerLinks.jsx";

const sections = [
  links.footer.section1,
  links.footer.section2,
  links.footer.section3,
  links.footer.section4
];

const badgeRows = [
  {title: "Learning", array: badges.learning},
  {title: "Agile", array: badges.agile},
  {title: "Hobbies", array: badges.hobbies}
];

const Footer = () => {
  const signNumber = Math.floor(Math.random() * 10);
  const signImage = `/signs/dp_sign_${signNumber <= 0 ? 1 : signNumber}.png`;

  return <div className="col gap10 glass pad20">
    <h2 className="dp-card__title">Work experience links</h2>

    <div className="row space-between gap5 mcol flex-wrap">
      {sections.map((section, index) => (
        <div key={`footer-section-${index}`} className="dp-footer-group">
          <FooterLinks linksArray={section}/>
        </div>
      ))}
    </div>

    <div className="col gap2">
      {badgeRows.map((row) => (
        <div key={row.title} className="row flex-wrap align-center gap2 m-footer-badge">
          <strong className="size14">{row.title}:</strong>
          <Badges array={row.array}/>
        </div>
      ))}
    </div>

    <img src={signImage} className="sign" alt="signature"/>
  </div>;
};

export default Footer;
