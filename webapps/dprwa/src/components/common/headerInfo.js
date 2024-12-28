import React from "react";
import Badges from "./badges";
import {config} from "../../configs/config";
import useApp from "../../hooks/useApp";

const HeaderInfo = (props) => {
  const {myAppOrg, gconfig} = useApp()

  return (
    <React.Fragment>
      <div className="header-bar pad10">
        <div className="row wrap">
          <div>
            <span className="size30">
            {config.name}
          </span>
          </div>
          <div>
            <span>{gconfig.logo}</span>
            <span className="size20 bl">{myAppOrg.orgname}</span>
          </div>
        </div>
        <div className="row size10">
          <span>{config.info}</span>
          <span>{myAppOrg.address} - {myAppOrg.rwainfo}</span>
        </div>
        <Badges list={config.enums.appGlobal.homeBadges}/>
      </div>
    </React.Fragment>
  );
};
export default React.memo(HeaderInfo);
