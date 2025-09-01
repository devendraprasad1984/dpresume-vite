import React, { useReducer } from "react";
import { contextReducers } from "../../_redux/reducers/contextReducers.js";

const ContextSampleApp = () => {
  const [state, dispatch] = useReducer(contextReducers, {count: 0});

  const increment = () => {
    dispatch({
      type: "INC",
      count: 1
    });
  };
  const decrement = () => {
    dispatch({
      type: "DEC",
      count: 1
    });
  };
  return <div>
    <h2>Context counter app</h2>
    <div className="row gap2 align-center space-between">
      <div>Count: {state.count}</div>
      <div className="wid50 row">
        <button onClick={increment}>INCREASE</button>
        <button onClick={decrement}>DECREASE</button>
      </div>
    </div>
  </div>;
};
export default ContextSampleApp;