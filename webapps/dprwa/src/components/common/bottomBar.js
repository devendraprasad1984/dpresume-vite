import React from "react";
import useApp from "../../hooks/useApp";
import {config} from "../../configs/config";

const BottomBar = (props) => {
  const {gconfig } = useApp()

  return <React.Fragment>
    <div className="row header-bar pad15 size12">
      <div className='col'>
        <span>{gconfig[config.enums.appGlobal.app_sign_line1]}</span>
        <span>{gconfig[config.enums.appGlobal.heading_line2]}</span>
      </div>

      <div className='col bl'>
        <span>(ver): 0.0.1</span>
        <span>(C): devendraprasad1984@gmail.com</span>
        <span>(M): +91 958 279 7772</span>
      </div>
    </div>
  </React.Fragment>
};
export default React.memo(BottomBar);
