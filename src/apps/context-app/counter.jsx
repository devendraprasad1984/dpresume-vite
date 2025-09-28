import React, { useEffect, useState } from "react";

let timer;
let n = 0;
const handleTimer = (setCount) => {
  timer = setInterval(() => {
    n += 1;
    if (n > 10) {
      clearInterval(timer);
      return;
    }
    setCount(n);
  }, 1000);
};
const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => handleTimer(setCount), []);

  return <div>
    <span>Counter: </span>
    <span>{count} - {count >= 10 ? "stopped" : ""}</span>
  </div>;
};
export default Counter;