import React from "react";
import homeExperiences from "../../core/homeExperiences.js";
import useMobile from "../../hooks/useMobile.js";
import HomeAppsWrapper from "../body/component/homeAppsWrapper.jsx";
import Right from "../body/component/right.jsx";

const Home = () => {
  const isMobile = useMobile();
  return <React.Fragment>
    <div>
      <div className="size20">
        <span>In the role of <b>Senior Staff Frontend</b> {`===>`}</span>
        <span class="text-muted">Principal / Architect frontend</span>, <span>I</span>
      </div>
      <ul className="">
        {homeExperiences.role.map((role, index) => <li key={`role-${index}`}
                                                       dangerouslySetInnerHTML={{__html: role}}/>)}
      </ul>
      <HomeAppsWrapper/>
      {isMobile && <Right/>}
    </div>
  </React.Fragment>;
};
export default Home;
