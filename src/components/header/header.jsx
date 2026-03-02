import links from "../../core/links.js";
import useScreen from "../../hooks/useScreen.js";
import HeaderNav from "../body/component/headerNav.jsx";

const getYearsExperience = () => {
  const dateYear = (new Date()).getFullYear();
  let yrs = dateYear - 2007;
  return yrs;
};

const Header = () => {
  const {handleScreenToggle} = useScreen();
  return <div className="col gap2">
    <HeaderNav/>
    <div className="relative wid100 height100p glass">
      <div className="flex row flex-center wid100 mflex-start gap5">
        <div className="wid5 mwid20 align-center">
          <img src="images/my-pic.jpeg" className="logo"/>
        </div>
        <div className="mcol flex row align-start wid100 space-between">
          <div className="col mcol left wid100">
            <span className="size24 bold">Devendra Prasad</span>
            <span className="size12 bold text-muted">Senior Staff Software Engineer</span>
          </div>
          <div className="flex col right mleft mwid100">
            <span className="size30 bold text-primary">{getYearsExperience()} yrs</span>
            <div className="row gap2">
              <a className="hyperlink" href={links.cv} target="_blank">CV</a>
              <a className="hyperlink" href={links.linkedIn} target="_blank">Linkedin</a>
              <a className="hyperlink" href={links.github} target="_blank">Github</a>
              <a className="hyperlink" href={links.hackerRankProfile} target="_blank">Algo</a>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <span className="email">devendraprasad1984@gmail.com</span>&nbsp;
        <span className="phone">+91-(958)-279-7772</span>
      </div>

      {1 === 2 && <div className="flex row flex-end">
        <button onClick={handleScreenToggle} className="rectangle-button button3 desktop-only">Toggle</button>
      </div>}
    </div>
  </div>;
};
export default Header;
