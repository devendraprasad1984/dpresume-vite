import React from "react";
import { Provider } from "react-redux";
import mainStore from "./store/mainStore.js";
import CounterComponent from "./counterComponent.jsx";

const ReduxCounterMain = () => {

  return <Provider store={mainStore}>
    <CounterComponent/>
  </Provider>;
};
export default ReduxCounterMain;