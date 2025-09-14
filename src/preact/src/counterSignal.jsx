import { signal } from "@preact/signals-react";

const counter = signal(0);
const counterObject = signal({
  count: 0
});

const up = () => {
  counter.value = counter.value + 1;
  counterObject.value = {
    count: counterObject.value.count + 1
  }; // mutate instead of replace
};

const down = () => {
  counter.value = counter.value - 1;
  counterObject.value.count--;
};

export default function CounterSignal() {
  return <div class="row space-between align-center border">
    <span>counter signal: {counter} / {counterObject.value.count}</span>
    <div className="row">
      <button onClick={up}>Up</button>
      <button onClick={down}>Down</button>
    </div>
  </div>;
}
