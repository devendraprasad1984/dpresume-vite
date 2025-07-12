import React from "react";

const SubmitForm = () => {

  const handleSubmit = () => {
    console.log("form is submitted");
  };

  return <div className="row gap2">
    <button onClick={handleSubmit}>Submit all forms</button>
  </div>;
};
export default SubmitForm;