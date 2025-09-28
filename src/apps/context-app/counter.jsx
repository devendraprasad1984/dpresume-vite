import React, { useEffect, useState } from "react";

let timer;
let n = 0;
const handleTimer = (setCount) => {
  timer = setInterval(() => {
    n += 1;
    if (n > 10) {
      n = 0;
      clearInterval(timer);
      return;
    }
    setCount(n);
  }, 1000);
};
const Counter = () => {
  const [count, setCount] = useState(0);

  const handleReset = () => {
    n = 0;
    setCount(0);
    handleTimer(setCount);
  };

  useEffect(() => handleTimer(setCount), []);

  return <div class="row gap2 align-center">
    <span>Counter: </span>
    <span className="size20 wt600 text-success" style={{minWidth: "50px"}}>{count} {count >= 10 ? "stopped" : ""}</span>
    <button onClick={handleReset}>reset</button>
  </div>;
};
export default Counter;