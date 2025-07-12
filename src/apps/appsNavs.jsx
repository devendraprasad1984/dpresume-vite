import React from "react";
import appEnum from "../enums/appEnum.js";
import { useNavigate } from "react-router-dom";

const AppsNavs = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    const found = location.href.indexOf(path) !== -1;
    if (found) {
      location.reload();
      return;
    }
    navigate("/apps/" + path, {replace: true});
  };

  return <div className="row gap2">
    <button className="bg-dark text-light"
            onClick={() => handleNavigate(appEnum.appKeys.ReduxCounterApp)}>{appEnum[appEnum.appKeys.ReduxCounterApp]}</button>
  </div>;

};
export default AppsNavs;