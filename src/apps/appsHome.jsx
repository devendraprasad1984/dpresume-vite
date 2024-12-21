import React, {useEffect, useRef, useState} from "react";
import MyButton from "../components/contextual/button.jsx";
import AppList from "./appList.jsx";
import DomHelper from "../core/domHelper.js";
import DOMEnum from "../enums/DOMEnum.js";
import core from "../core/core.js";
import useAppSelectorComponentMap, {appMap} from "../hooks/useAppSelectorComponentMap.js";
import {useParams} from "react-router-dom";
import appEnum from "../enums/appEnum.js";

const AppsHome = () => {
  const params = useParams();
  const appKeys = Object.keys(appMap);
  const id = appEnum[params?.id] || appKeys[0];
  const [currentApp, setCurrentApp] = useState(id);
  const list2Ref = useRef();

  useEffect(() => {
    if (id !== currentApp) {
      setCurrentApp(id);
    }
  }, [id]);

  const ThisApp = useAppSelectorComponentMap({currentApp});
  if (core.isNull(ThisApp)) {
    return "Please try later";
  }

  const handleAppSelectorButton = (e) => {
    e?.preventDefault();
    const select1 = DomHelper.getByDOMId(DOMEnum.appSelectList1);
    const curVal = core.coalesce(select1.value, list2Ref?.current?.dataset?.value);
    setCurrentApp(curVal);
  };
  return <div className="col gap2">
    <h2 className="bold">Some of my practice apps</h2>
    <div className="row border-bottom pad5 gap1 wid100 align-center">
      <AppList
        showVanilla={true}
        ref={list2Ref}
        defaultValue={currentApp}
        setCurrentApp={setCurrentApp}
      />
      <MyButton
        onClick={handleAppSelectorButton}
        classes="button-18"
      >Show</MyButton>
    </div>
    <div className="size38 msize24 wt600">{currentApp}</div>
    {core.isPresent(currentApp) && <div className="wid100 mwid100 col gap2">
      <React.Suspense fallback={<div className="text-danger size20">Please wait...</div>}>
        <ThisApp/>
      </React.Suspense>
    </div>}
  </div>;
};
export default AppsHome;
