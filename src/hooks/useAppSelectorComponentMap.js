import React from "react";
import appEnum from "../enums/appEnum.js";
import core from "../core/core.js";

const LazySimpleForm = React.lazy(() => import("../apps/simpleForm/simpleForm.jsx"));
const LazyNetFlix = React.lazy(() => import("../apps/netflix/netflix.jsx"));
const LazyGeekAdmin = React.lazy(() => import("../apps/geek/admin-video.jsx"));


export const appMap = {
  [appEnum.simpleForm]: LazySimpleForm,
  [appEnum.netflix]: LazyNetFlix,
  [appEnum.geekAdminVideo]: LazyGeekAdmin,
};

const useAppSelectorComponentMap = ({currentApp}) => {
  if (!core.isPresent(currentApp)) {
    return;
  }
  return appMap[currentApp];
};
export default useAppSelectorComponentMap;