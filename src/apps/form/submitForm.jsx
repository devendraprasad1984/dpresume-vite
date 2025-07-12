import React from "react";
import { useSelector } from "react-redux";
import allSectors from "../redux-app/reducers/allSectors.js";
import oneliners from "../../../oneliners/oneliners.js";

const SubmitForm = () => {
  const counter = useSelector(allSectors.counterSelector);
  let formsObject = {};
  const handleSubmit = () => {
    for (let i = 0; i < counter; i++) {
      const thisForm = oneliners.domHelpers.getByDOMId("form-" + i);
      if (oneliners.core.isObjectPresent(thisForm)) {
        formsObject["forms-" + i] = {
          fname: oneliners.domHelpers.getByDOMId("fname-" + i).value,
          lname: oneliners.domHelpers.getByDOMId("lname-" + i).value,
          email: oneliners.domHelpers.getByDOMId("email-" + i).value,
          fname_1: thisForm.childNodes[0].value,
          lname_1: thisForm.childNodes[1].value,
          email_1: thisForm.childNodes[2].value
        };
      }
    }
    console.log("final forms object", formsObject);
  };

  return <div className="row gap2">
    <button onClick={handleSubmit}>Submit all forms</button>
  </div>;
};
export default SubmitForm;