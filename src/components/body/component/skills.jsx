import PrintList from "./printList.jsx";

const skills = ["Javascript", "React.JS", "AEM", "Python", "MySql"];

const Skills = () => {
  return <div className="dp-card hover-lift anim-shimmer">
    <div className="dp-card__title">Skills</div>
    {PrintList(skills, "counter-color-light-blue", "flix")}
  </div>;
};

export default Skills;
