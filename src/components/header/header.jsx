import links from "../../core/links.js";
import HeaderNav from "../body/component/headerNav.jsx";

const quickLinks = [
  {href: links.cv, label: "CV"},
  {href: links.linkedIn, label: "Linkedin"},
  {href: links.github, label: "Github"},
  {href: links.hackerRankProfile, label: "Algo"}
];

const getYearsExperience = () => (new Date()).getFullYear() - 2007;

const Header = () => {
  return <div className="col gap5">
    <HeaderNav/>

    <div className="relative wid100 glass dp-hero anim-fade-up" style={{"--stagger": 2}}>
      <div className="flex row flex-start align-center wid100 mflex-start gap5 mcol">
        <div className="dp-avatar-wrap anim-float">
          <img src="images/my-pic.jpeg" className="logo" alt="Devendra Prasad"/>
        </div>

        <div className="mcol flex row align-center wid100 space-between gap5">
          <div className="col left wid100">
            <span className="dp-name anim-gradient-text">Devendra Prasad</span>
            <span className="dp-role">Senior Staff Software Engineer</span>
          </div>

          <div className="flex col right mleft mwid100">
            <span className="dp-years anim-gradient-text">{getYearsExperience()} yrs</span>
            <div className="dp-quicklinks">
              {quickLinks.map((link, index) => (
                <a
                  key={link.label}
                  className="hyperlink anim-fade-left"
                  style={{"--stagger": index + 3}}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dp-contact">
        <a className="dp-contact__chip link-sweep" href="mailto:devendraprasad1984@gmail.com">
          <span aria-hidden="true">{"\u2709\uFE0F"}</span> devendraprasad1984@gmail.com
        </a>
        <a className="dp-contact__chip link-sweep" href="tel:+919582797772">
          <span aria-hidden="true">{"\uD83D\uDCDE"}</span> +91-(958)-279-7772
        </a>
      </div>
    </div>
  </div>;
};

export default Header;
