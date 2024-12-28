import React from "react";
import "./App.css";
import Main from "./components/main";
import {config, handleLocalStorage} from "./configs/config";
import useAPI from "./hooks/useAPI";
import NoData from "./components/common/nodata";
import {AppContextProvider} from "./context/appContext";
import ErrorBoundary from "./components/common/errorBoundary";
// import Login from "./components/screens/login";

const nameFromLocalStorage = handleLocalStorage.get(
  config.enums.localStorage.name
);
const isNameSet =
  nameFromLocalStorage !== "" &&
  nameFromLocalStorage !== null &&
  nameFromLocalStorage !== undefined;

function App(props) {
  const appConfig = useAPI(config.endpoints.appConfig)
  const app = {
    appConfig: appConfig.data
  }

  if (appConfig?.loading === true || !appConfig.data || appConfig.data.length === 0) return <NoData text={config.messages.PLZ_WAIT}/>;
  if (appConfig?.error) return <NoData text={config.messages.ERROR}/>;
  return <React.Fragment>
    <AppContextProvider value={{...app}}>
      <ErrorBoundary>
        <Main/>
      </ErrorBoundary>
    </AppContextProvider>
  </React.Fragment>
}

export default App;
