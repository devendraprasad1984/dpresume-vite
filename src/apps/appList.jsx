import React from "react";
import appEnum from "../enums/appEnum.js";
import DOMEnum from "../enums/DOMEnum.js";
import {ListSubheader, MenuItem, Select} from "@mui/material";

const AppList = ({
                   defaultValue,
                   classes,
                   ...restProps
                 }) => {
  return <div className="row gap1">
    <Select native
            defaultValue={defaultValue}
            className={`base-select app-select-menu ${classes}`}
            label="Choose an app"
            id={DOMEnum.appSelectList1}
    >
      <optgroup label="Simple">
        <option value={appEnum.customWebComponent}>{appEnum.customWebComponent}</option>
      </optgroup>
      <optgroup label="Complex">
        <option value={appEnum.netFlix}>{appEnum.netFlix}</option>
      </optgroup>
    </Select>

    <Select
      defaultValue={defaultValue}
      className={`base-select app-select-menu ${classes}`}
      label="Choose an app"
      id={DOMEnum.appSelectList2}
    >
      <MenuItem value={appEnum.customWebComponent}>{appEnum.customWebComponent}</MenuItem>
      <MenuItem value={appEnum.netFlix}>{appEnum.netFlix}</MenuItem>
    </Select>
  </div>;
};
export default AppList;
