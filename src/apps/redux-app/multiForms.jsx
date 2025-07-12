import React, { useCallback } from "react";
import SubmitForm from "../form/submitForm.jsx";
import { useSelector } from "react-redux";
import allSectors from "./reducers/allSectors.js";
import SimpleNameForm from "../form/simpleNameForm.jsx";

const MultiForm = () => {
  let forms = [];
  const counter = useSelector(allSectors.counterSelector);

  const renderAllForms = useCallback(() => {
    for (let i = 0; i < counter; i++) {
      forms.push(<SimpleNameForm index={i}/>);
    }
    return forms;
  }, [counter]);

  if (counter <= 0) {
    return <div>no forms found</div>;
  }

  return <React.Fragment>
    <SubmitForm/>
    {renderAllForms()}
  </React.Fragment>;
};
export default MultiForm;