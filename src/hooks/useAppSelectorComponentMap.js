import React from "react";
import appEnum from "../enums/appEnum.js";
import oneliners from "oneliners";

const LazySimpleForm = React.lazy(() => import("../apps/simpleForm/simpleForm.jsx"));
const LazyNetFlix = React.lazy(() => import("../apps/netflix/netflix.jsx"));
const LazyGeekAdmin = React.lazy(() => import("../apps/geek/admin-video.jsx"));
const LazyVanillaJSHome = React.lazy(() => import("../apps/vanila-js/vanila-js-home.jsx"));
const LazyVanillaJSRedux = React.lazy(() => import("../apps/vanila-js-redux/vanila-js-redux.jsx"));
const JSSampleFunctionOutput = React.lazy(() => import("../apps/jsTests/jsTests.jsx"));
const ReduxCounterApp = React.lazy(() => import("../apps/redux-counter/main.jsx"));
const ContextSampleApp = React.lazy(() => import("../apps/context-app/main.jsx"));

export const appMap = {
  [appEnum[appEnum.appKeys.netflix]]: LazyNetFlix,
  [appEnum[appEnum.appKeys.simpleForm]]: LazySimpleForm,
  [appEnum[appEnum.appKeys.geekAdminVideo]]: LazyGeekAdmin,
  [appEnum[appEnum.appKeys.vanillJSHome]]: LazyVanillaJSHome,
  [appEnum[appEnum.appKeys.vanillJSRedux]]: LazyVanillaJSRedux,
  [appEnum[appEnum.appKeys.JSApps]]: JSSampleFunctionOutput,
  [appEnum[appEnum.appKeys.ReduxCounterApp]]: ReduxCounterApp,
  [appEnum[appEnum.appKeys.ContextSimpleApp]]: ContextSampleApp,
};

const useAppSelectorComponentMap = ({currentApp}) => {
  if (!oneliners.core.isPresent(currentApp)) {
    return;
  }
  return appMap[currentApp];
};
export default useAppSelectorComponentMap;