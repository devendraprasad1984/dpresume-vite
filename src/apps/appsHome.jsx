import React, {useState} from "react";
import MyButton from "../components/contextual/button.jsx";
import AppList from "./appList.jsx";
import DomHelper from "../core/domHelper.js";
import DOMEnum from "../enums/DOMEnum.js";
import core from "../core/core.js";
import useAppSelectorComponentMap from "../hooks/useAppSelectorComponentMap.js";
import appEnum from "../enums/appEnum.js";

const AppsHome = () => {
  const [currentApp, setCurrentApp] = useState(appEnum.netFlix);

  const ThisApp = useAppSelectorComponentMap({currentApp});

  const handleAppSelectorButton = (e) => {
    e.preventDefault();
    const select1 = DomHelper.getByDOMId(DOMEnum.appSelectList1);
    const select2 = DomHelper.getByDOMId(DOMEnum.appSelectList2);
    setCurrentApp(select1.value);
  };
  return <div className="col gap2">
    <h2>All my practice apps</h2>
    <div className="row border-bottom pad5">
      <AppList defaultValue={currentApp}/>
      <MyButton
        onClick={handleAppSelectorButton}
      >Show</MyButton>
    </div>
    {core.isPresent(currentApp) && <ThisApp/>}
  </div>;
};
export default AppsHome;
