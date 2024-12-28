import React, { createContext, useContext } from "react";

const getUserAgent = () => {
  if (typeof window === "undefined") return null;
  return window?.navigator?.userAgent?.toLowerCase();
};
const getIsMobile = () => {
  let userAgent = getUserAgent();
  if (!userAgent) return false;
  return (
    userAgent.indexOf("phone") !== -1 ||
    userAgent.indexOf("mobile") !== -1 ||
    userAgent.match(/Android/i) ||
    userAgent.match(/iPhone/i) ||
    window.matchMedia("(any-pointer:coarse)").matches
  );
};
export const initAppData = () => {
  return {
    isMobile: getIsMobile(),
  };
};

const ReactAppContext = createContext();
export const useReactAppContext = () => useContext(ReactAppContext);
export default ReactAppContext;
