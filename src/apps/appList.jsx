import React, {useState} from "react";
import appEnum from "../enums/appEnum.js";
import DOMEnum from "../enums/DOMEnum.js";
import {MenuItem, Select} from "@mui/material";
import core from "../core/core.js";

const AppList = React.forwardRef(({
                                    defaultValue,
                                    showVanilla,
                                    classes,
                                    setCurrentApp,
                                    ...restProps
                                  }, ref) => {
  const [value, setValue] = useState(defaultValue);

  const handleOnChange = (e, thisProps) => {
    const curVal = core.coalesce(thisProps?.props?.value, e?.target?.value);
    setCurrentApp(curVal);
    setValue(curVal);
  };
  return <div className="row gap1 wid100">
    {showVanilla && <Select native
                            defaultValue={value}
                            className={`base-select app-select-menu wid100 ${classes}`}
                            label="Choose an app"
                            id={DOMEnum.appSelectList1}
    >
      <option value={appEnum.simpleForm}>{appEnum.simpleForm}</option>
      <option value={appEnum.netflix}>{appEnum.netflix}</option>
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
      <MenuItem value={appEnum.netflix}>{appEnum.netflix}</MenuItem>
      <MenuItem value={appEnum.simpleForm}>{appEnum.simpleForm}</MenuItem>
    </Select>}
  </div>;
});
export default AppList;
