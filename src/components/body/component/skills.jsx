import PrintList from "./printList.jsx";

const skills = ["Javascript", "typescript", "NextJs16", "React19", "AEM", "Python", "MySql", "mongodb", "NodeJs", "ExpressJs", "HTML5", "CSS3", "SASS", "Bootstrap", "TailwindCss", "GitHub", "GitLab", "Jira", "Agile Methodology"];

const Skills = () => {
  return <div className="dp-card hover-lift anim-shimmer">
    <div className="dp-card__title">Skills</div>
    {PrintList(skills, "counter-color-light-blue", "flix")}
  </div>;
};

export default Skills;
