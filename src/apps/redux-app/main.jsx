import React from "react";
import { Provider } from "react-redux";
import mainStore from "./store/mainStore.js";
import CounterComponent from "./counterComponent.jsx";
import MultiForm from "./multiForms.jsx";

const ReduxCounterMain = () => {
  return <Provider store={mainStore}>
    <div className="col gap2">
      <CounterComponent/>
      <MultiForm/>
    </div>
  </Provider>;
};
export default ReduxCounterMain;