import React from "react";
import Title from "../body/component/title.jsx";
import homeExperiences from "../../core/homeExperiences.js";
import useMobile from "../../hooks/useMobile.js";
import Right from "../body/component/right.jsx";

const Home = () => {
  const isMobile = useMobile();
  return <React.Fragment>
    <div>
      <Title><h2>In the role of <u>Senior Staff Frontend</u>, I</h2></Title>
      <ul className="star-list">
        {homeExperiences.role.map((role, index) => <li key={`role-${index}`} dangerouslySetInnerHTML={{__html: role}} />)}
      </ul>
      {isMobile && <Right/>}
    </div>
  </React.Fragment>;
};
export default Home;
