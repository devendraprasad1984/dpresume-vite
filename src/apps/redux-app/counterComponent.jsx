import React from "react";
import { useDispatch, useSelector } from "react-redux";
import allSectors from "./reducers/allSectors.js";
import { counterActions } from "./reducers/counters/counterReducer.js";
import counterHelper from "./reducers/counters/counterHelper.js";

const CounterComponent = () => {
  const counter = useSelector(allSectors.counterSelector);
  const dispatch = useDispatch();

  const increase = () => {
    dispatch(counterActions.increment({value: 1}));
  };
  const decrease = () => {
    dispatch(counterActions.decrement({value: 1}));
  };
  const increaseAsync = () => {
    dispatch(counterHelper.counterAsyncIncrement({value: 10}));
  };
  const decreaseAsync = () => {
    dispatch(counterHelper.counterAsyncDecrement({value: 2}));
  };
  return <div>
    <div>count: {counter}</div>
    <div className="row gap2">
      <button className="bg-primary text-light" onClick={increase}>UP</button>
      <button className="bg-secondary text-light" onClick={decrease}>DOWN</button>
      <button className="bg-candy text-danger" onClick={increaseAsync}>ASYNC UP</button>
      <button className="bg-danger text-light" onClick={decreaseAsync}>ASYNC DOWN</button>
    </div>
  </div>;
};
export default CounterComponent;