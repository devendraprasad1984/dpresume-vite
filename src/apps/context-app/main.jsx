import React, { useReducer } from "react";
import { contextReducers } from "../../_redux/reducers/contextReducers.js";

const ContextSampleApp = () => {
  const [state, dispatch] = useReducer(contextReducers, { count: 0 });

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
  return <div className="col">
    <div>Count: {state.count}</div>
    <button onClick={increment}>INCREASE</button>
    <button onClick={decrement}>DECREASE</button>
  </div>;
};
export default ContextSampleApp;