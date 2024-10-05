import React from "react";
import Title from "../body/component/title.jsx";

const About = () => {
  return <React.Fragment>
    <div>
      <Title title="About me"/>
      <div>
        Passionate frontend software engineer. A <b>React/Javascript</b> enthusiast, I have variety of frontend
        development
        experience.
        I have total <b>17+</b> years of experience in IT Industry. Following are the companies I work for,
        <ul className="star-list">
          <li><strong>Blackhawk Network India Pvt Ltd (BHN): 2yrs</strong></li>
          <li>Fictiv India Pvt Ltd: 2months</li>
          <li>Thoughtworks via Geektrust (Contact to hire): 6months</li>
          <li>Royal Bank of Scotland (RBS) - 10yrs</li>
          <li>Syntel Inc - 1.3yrs</li>
        </ul>
      </div>
    </div>
  </React.Fragment>;
};
export default About;
