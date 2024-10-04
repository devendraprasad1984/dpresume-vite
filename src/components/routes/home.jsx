import React from "react";
import Title from "../body/component/title.jsx";
import flatList from "../../core/flatList.js";

const Home = () => {
  return <React.Fragment>
    <div>
      <Title><h2>In the role of <u>Senior Staff Frontend</u>, I</h2></Title>
      <ul className="star-list">
        {flatList.role.map((role, index) => <li key={`role-${index}`}>{role}</li>)}
      </ul>
    </div>
  </React.Fragment>;
};
export default Home;
