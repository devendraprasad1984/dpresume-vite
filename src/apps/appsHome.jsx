import React, {useRef, useState} from "react";
import MyButton from "../components/contextual/button.jsx";
import AppList from "./appList.jsx";
import DomHelper from "../core/domHelper.js";
import DOMEnum from "../enums/DOMEnum.js";
import core from "../core/core.js";
import useAppSelectorComponentMap, {appMap} from "../hooks/useAppSelectorComponentMap.js";

const AppsHome = () => {
  const appKeys = Object.keys(appMap);
  const [currentApp, setCurrentApp] = useState(appKeys[0]);
  const list2Ref = useRef();

  const ThisApp = useAppSelectorComponentMap({currentApp});

  const handleAppSelectorButton = (e) => {
    e?.preventDefault();
    const select1 = DomHelper.getByDOMId(DOMEnum.appSelectList1);
    const curVal = core.coalesce(select1.value, list2Ref?.current?.dataset?.value);
    setCurrentApp(curVal);
  };
  return <div className="col gap2">
    <h2>some of my practice apps</h2>
    <div className="row border-bottom pad5 gap1 wid100">
      <AppList
        showVanilla={true}
        ref={list2Ref}
        defaultValue={currentApp}
        setCurrentApp={setCurrentApp}
      />
      <MyButton
        onClick={handleAppSelectorButton}
      >Show</MyButton>
    </div>
    <div className="size38 msize24 wt600 base-gimic green-gimic-text">{currentApp}</div>
    {core.isPresent(currentApp) && <div className="wid100 mwid100 col gap10">
      <React.Suspense fallback={<div>Please wait...</div>}>
        <ThisApp/>
      </React.Suspense>
    </div>}
  </div>;
};
export default AppsHome;
