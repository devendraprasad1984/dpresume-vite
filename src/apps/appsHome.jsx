import React, {useRef, useState} from "react";
import MyButton from "../components/contextual/button.jsx";
import AppList from "./appList.jsx";
import DomHelper from "../core/domHelper.js";
import DOMEnum from "../enums/DOMEnum.js";
import core from "../core/core.js";
import useAppSelectorComponentMap from "../hooks/useAppSelectorComponentMap.js";
import appEnum from "../enums/appEnum.js";

const AppsHome = () => {
  const [currentApp, setCurrentApp] = useState(appEnum.netflix);
  const list2Ref = useRef();

  const ThisApp = useAppSelectorComponentMap({currentApp});

  const handleAppSelectorButton = (e) => {
    e.preventDefault();
    const select1 = DomHelper.getByDOMId(DOMEnum.appSelectList1);
    const curVal = core.coalesce(select1.value, list2Ref?.current?.dataset?.value);
    setCurrentApp(curVal);
  };
  return <div className="col gap2">
    <h2>All my practice apps</h2>
    <div className="row border-bottom pad5">
      <AppList ref={list2Ref} defaultValue={currentApp} setCurrentApp={setCurrentApp}/>
      <MyButton
        onClick={handleAppSelectorButton}
      >Show</MyButton>
    </div>
    <div className="size20 wt600">{currentApp}</div>
    {core.isPresent(currentApp) && <ThisApp/>}
  </div>;
};
export default AppsHome;
