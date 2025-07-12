import React from "react";

const SimpleNameForm = ({
  index = 0
}) => {
  return <div role="form" id={"form-" + index} className="row gap2">
    <input type="text" name="fname" id={"fname-" + index} placeholder={"Enter first name - " + index}/>
    <input type="text" name="lname" id={"lname-" + index} placeholder={"Enter last name - " + index}/>
    <input type="email" name="email" id={"email-" + index} placeholder={"Enter email - " + index}/>
  </div>;
};
export default SimpleNameForm;