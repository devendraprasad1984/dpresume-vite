import React, {useState} from "react";
import DOMEnum from "../enums/DOMEnum.js";
import {MenuItem, Select} from "@mui/material";
import {appMap} from "../hooks/useAppSelectorComponentMap.js";
import oneliners from "oneliners";

const SimpleAppOptions = () => {
  const keys = Object.keys(appMap);
  return keys.map((key, index) => {
    return <option key={"app-option-" + index} value={key}>{key}</option>;
  });
};
const AppMenu = () => {
  const keys = Object.keys(appMap);
  return keys.map((key, index) => {
    return <MenuItem key={"app-menu-" + index} value={key}>{key}</MenuItem>;
  });
};

// eslint-disable-next-line react/display-name
const AppList = React.forwardRef(({
  defaultValue,
  showVanilla,
  classes,
  setCurrentApp,
  ...restProps
}, ref) => {
  const [value, setValue] = useState(defaultValue);

  const handleOnChange = (e, thisProps) => {
    const curVal = oneliners.core.coalesce(thisProps?.props?.value, e?.target?.value);
    setCurrentApp(curVal);
    setValue(curVal);
  };
  return <div className="row gap1 wid100">
    {showVanilla && <Select native
                            defaultValue={value}
                            onChange={(e) => handleOnChange(e)}
                            className={`base-select app-select-menu wid100 ${classes}`}
                            label="Choose an app"
                            id={DOMEnum.appSelectList1}
    >
      <SimpleAppOptions/>
    </Select>}

    {!showVanilla && <Select
      ref={ref}
      onChange={(e, value) => handleOnChange(e, value)}
      value={value}
      data-value={value}
      className={`base-select app-select-menu  wid100 ${classes}`}
      label="Choose an app"
      id={DOMEnum.appSelectList2}
    >
      <AppMenu/>
    </Select>}
  </div>;
});
export default AppList;
