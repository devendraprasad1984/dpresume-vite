import React from 'react';
import Title from "../body/component/title.jsx";

const fillHome = () => {
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(<li className="roman">Hello World</li>)
  }
  return arr;
}
const Home = () => {
  return <React.Fragment>
    <div>
      <Title title="Home"/>
      <ul className="double-list">{fillHome()}</ul>
    </div>
  </React.Fragment>
};
export default Home;
