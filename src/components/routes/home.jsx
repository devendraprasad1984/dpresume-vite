import homeExperiences from "../../core/homeExperiences.js";
import useMobile from "../../hooks/useMobile.js";
import CertsView from "../body/component/CertsView";
import HomeAppsWrapper from "../body/component/homeAppsWrapper.jsx";
import Right from "../body/component/right.jsx";

const Home = () => {
  const isMobile = useMobile();

  return <div className="col gap5">
    <div className="dp-headline anim-fade-up" style={{"--stagger": 1}}>
      <span>In the role of <b>Senior Staff Frontend</b> {`===>`} </span>
      <span className="anim-gradient-text">Principal / Architect frontend</span>
      <span>, I</span>
    </div>

    <ul className="dp-prose dp-role-list">
      {homeExperiences.role.map((role, index) => (
        <li
          key={`role-${index}`}
          className="reveal"
          style={{"--stagger": Math.min(index, 6)}}
          dangerouslySetInnerHTML={{__html: role}}
        />
      ))}
    </ul>

    <CertsView/>
    <HomeAppsWrapper/>
    {isMobile && <Right/>}
  </div>;
};

export default Home;
