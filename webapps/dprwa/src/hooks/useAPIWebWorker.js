import {useEffect, useRef, useState} from "react";
import workerFactory from "../webworkers/webWorkerFactory_Builder";
import {debouncing} from "../configs/debouncingThrottling";
// import { calculatePerformance } from "../configs/utils";

const useAPIWebWorker = (url, reload = false) => {
  const firstRender = useRef(true);
  const changeInUrl = useRef(url);
  const pullFromApiWorker = workerFactory(); //for UI performance, moving some api handling running in parallel other than main thread and //
  // syncing up via event onmessage and postMessage of web worker

  // let { runtime, perftime } = calculatePerformance(); //closure
  const [data, setData] = useState([]);
  // const [time, setTime] = useState("");
  // const [loadTime, setLoadtime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!firstRender.current && changeInUrl.current === url && !reload) return;
    //mounting
    setLoading(true);
    if (firstRender.current || changeInUrl.current !== url || reload) {
      debouncing(pullFromApiWorker.postMessage({uri: url}));
    }
    pullFromApiWorker.onmessage = (res) => {
      let apiData = res.data;
      if (apiData.error !== undefined) {
        setError({error: apiData.error});
        // setTime((t) => runtime());
        // setLoadtime((t) => perftime());
      } else {
        setData(apiData.data === null ? [] : apiData.data);
        // setTime((t) => runtime());
        // setLoadtime((t) => perftime());
      }

      firstRender.current = false;
      changeInUrl.current = url;
      pullFromApiWorker.terminate();
      setLoading(false);
    };
  }, [url, reload]);
  return {data, loading, error};
};
export default useAPIWebWorker;
