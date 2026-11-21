import {useEffect, useState} from "react";

const MD_URL = "/docs/devendra_prasad.md";

const Resume = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(MD_URL).then((res) => res.text()).then(setText).catch(() => setText("Unable to load resume."));
  }, []);

  return <div className="col gap5">
    <div className="row space-between align-center flex-wrap gap5">
      <h2 className="dp-card__title">devendra_prasad.md</h2>
      <a className="nav-link dp-nav__link active" href={MD_URL} download="devendra_prasad.md">Download CV (.md)</a>
    </div>
    <pre className="dp-resume-md">{text}</pre>
  </div>;
};

export default Resume;
