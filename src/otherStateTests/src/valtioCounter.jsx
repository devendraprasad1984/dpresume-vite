import { proxy, useSnapshot } from "valtio";

const counter = proxy({
  count: 0
});

export default function CounterValtio() {
  const counterState = useSnapshot(counter);

  const up = () => {
    counter.count++;
  };

  const down = () => {
    counter.count = counterState.count - 1;
  };

  return <div class="row space-between align-center border">
    <span>counter valtio: {counter.count}</span>
    <div className="row">
      <button onClick={up}>Up</button>
      <button onClick={down}>Down</button>
    </div>
  </div>;
}
