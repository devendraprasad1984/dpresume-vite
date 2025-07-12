import React from "react";
import { useDispatch, useSelector } from "react-redux";
import allSectors from "./reducers/allSectors.js";
import { counterActions } from "./reducers/counterReducer.js";

const CounterComponent = () => {
  const counter = useSelector(allSectors.counterSelector);
  const dispatch = useDispatch();

  const increase = () => {
    dispatch(counterActions.increment({value: 1}));
  };
  const decrease = () => {
    dispatch(counterActions.decrement({value: 1}));
  };
  return <div>
    <div>count: {counter}</div>
    <div className="row gap2">
      <button className="bg-primary text-light" onClick={increase}>UP</button>
      <button className="bg-secondary text-light" onClick={decrease}>DOWN</button>
    </div>
  </div>;
};
export default CounterComponent;