import React from "react";
import appEnum from "../enums/appEnum.js";
import core from "../core/core.js";

const LazySimpleForm = React.lazy(() => import("../apps/simpleForm/simpleForm.jsx"));
const LazyNetFlix = React.lazy(() => import("../apps/netflix/netflix.jsx"));
const LazyGeekAdmin = React.lazy(() => import("../apps/geek/admin-video.jsx"));
const LazyVanillaJSHome = React.lazy(() => import("../apps/vanila-js/vanila-js-home.jsx"));
const LazyVanillaJSRedux = React.lazy(() => import("../apps/vanila-js-redux/vanila-js-redux.jsx"));

export const appMap = {
  [appEnum.simpleForm]: LazySimpleForm,
  [appEnum.netflix]: LazyNetFlix,
  [appEnum.geekAdminVideo]: LazyGeekAdmin,
  [appEnum.vanillJSHome]: LazyVanillaJSHome,
  [appEnum.vanillJSRedux]: LazyVanillaJSRedux,
};

const useAppSelectorComponentMap = ({currentApp}) => {
  if (!core.isPresent(currentApp)) {
    return;
  }
  return appMap[currentApp];
};
export default useAppSelectorComponentMap;