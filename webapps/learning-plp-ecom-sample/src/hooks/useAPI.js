import {useEffect, useState} from "react";

import get from "../apis";

const useAPI = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    //mouting
    setLoading(true);
    get(url, (res) => {
      if (res.error !== undefined) setError({ error: res.error });
      else {
        setData(res.data === null ? [] : res.data);
        setLoading(false);
      }
    });
    return () => {
      //unmounting
      setLoading(false);
    };
  }, []);
  return { data, loading, error };
};
export default useAPI;
