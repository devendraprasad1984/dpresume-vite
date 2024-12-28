import React from "react";

import AppStore from "./app-store";
import MeetStore from "./meet-store";

const appStore = React.createContext({
  appStore: new AppStore(),
  meetStore: new MeetStore(),
});

const useAppStores = () => React.useContext(appStore);

export default useAppStores;
