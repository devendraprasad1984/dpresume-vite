import React from "react";
import Title from "../body/component/title.jsx";
import aboutUs from "../../core/aboutUs.js";
import BehindBars from "../body/component/behindBars.jsx";

const About = () => {
  return <React.Fragment>
    <div>
      <Title title="About me"/>
      <div>
        <ul className="star-list">
          {aboutUs.role.map((role, index) => <li key={`role-${index}`} dangerouslySetInnerHTML={{__html: role}}/>)}
        </ul>
        <BehindBars/>
      </div>
    </div>
  </React.Fragment>;
};
export default About;
