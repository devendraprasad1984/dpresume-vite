import React from 'react';
import Title from "../body/component/title.jsx";

const Home = () => {
  return <React.Fragment>
    <div>
      <Title title="Home"/>
      <h2>In the role of <u>Senior Staff Frontend</u>, I</h2>
      <ul className="star-list">
        <li>have successfully dealt many enterprise apps while working in small/big organizations.</li>
        <li>practice TDD based frontend development mainly AEM, React, HTML, CSS, JS, JWT.</li>
        <li>practice CI/CD and github action workflows to code scans and deployments.</li>
        <li>know client-server + MonoRepo + REST + Monolithic + Microservice + Micro frontend architectures.</li>
        <li>contribute to engineering metrics, working groups, architecture design and leadership discussions.</li>
        <li>maintain code quality using sonarqube, git hooks, Snyk scans and constant review cycle.</li>
        <li>know JWT auth tokens (refresh + access), RS256 (public-private keys) / HS256 (secret key &
        certificate), XSS, CSRF, cookies, CORS.</li>
        <li>wear multiple hats during various phases of software development and act as a bridge between</li>
        <li>junior and senior members in the team.</li>
        <li>use jfrog/nexus repo / artifactory to manage code artifacts.</li>
        <li>Code. Collaborate. Build. Change. Incident. Release. Triage.</li>
        <li>help in recruiting, grow and enabling team.</li>
        <li>am a code reviewer, mentor, and face to dev team.</li>
        <li>use JIRA | Rally | Leankit | Trello for agility, bug tracking and backlog grooming</li>
      </ul>
    </div>
  </React.Fragment>
};
export default Home;
