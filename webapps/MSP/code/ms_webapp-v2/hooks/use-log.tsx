import React, { useCallback } from "react";
import { AxiosError } from "axios";

const useLog = () => {
  // TODO: Connect with logger APIs
  const logServerError = useCallback((error: AxiosError) => {
    console.error(error);
  }, []);

  return {
    logServerError,
  };
};

export default useLog;
