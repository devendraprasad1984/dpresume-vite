import {useEffect, useRef, useState} from "react";

import get from "../apis";
import {debouncing} from "../configs/debouncingThrottling";
// import { calculatePerformance } from "../configs/utils";

const useAPI = (url) => {
  const firstRender = useRef(true);
  const changeInUrl = useRef(url);
  // let { runtime } = calculatePerformance(); //closure
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [time, setTime] = useState("");
  // const [loadTime, setLoadtime] = useState('');

  useEffect(() => {
    if (!firstRender.current && changeInUrl.current === url) return;
    //mounting
    setLoading(true);
    debouncing(get(url, (res) => {
      if (res.error !== undefined) {
        setError({error: res.error});
        // setTime(t => runtime())
      } else {
        setData(res.data === null ? [] : res.data);
        // setTime(t => runtime())
      }
      setLoading(false);
    }));
    firstRender.current = false;
    // return () => {
    //     //unmounting
    //     setLoading(false);
    // };
  }, [url]);
  return {data, loading, error};
};
export default useAPI;
