import React from "react";
import DesignConceptTable from "./designConceptTable.jsx";

const JsConcepts = () => {
  return <div className="col gap10">
    <div className="bold size20">JS Core concepts</div>
    <div>
      <h1>Design Pattern Table</h1>
      <DesignConceptTable/>
    </div>
    <div>
      <div className="bold size20">JS Design Pattern</div>
    </div>
  </div>;
};
export default JsConcepts;