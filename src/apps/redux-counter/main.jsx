import React, { useCallback } from "react";
import { Provider } from "react-redux";
import mainStore from "./store/mainStore.js";
import CounterComponent from "./counterComponent.jsx";
import SimpleNameForm from "../form/simpleNameForm.jsx";
import SubmitForm from "../form/submitForm.jsx";

const ReduxCounterMain = () => {
  const index = 0;
  const counter = 5;
  let forms = [];

  const renderAllForms = useCallback(() => {
    for (let i = 0; i < counter; i++) {
      forms.push(<SimpleNameForm index={i}/>);
    }
    return forms;
  }, [counter]);

  return <Provider store={mainStore}>
    <div className="col gap2">
      <CounterComponent/>
      <SubmitForm/>
      {renderAllForms()}
    </div>
  </Provider>;
};
export default ReduxCounterMain;