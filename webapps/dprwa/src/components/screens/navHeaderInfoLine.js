import React from "react";
import {config, handleLocalStorage, mobileCheck} from "../../configs/config";

const NavHeaderLineInfo = (props) => {
  const { open, setOpen } = props;

  const ismobile = mobileCheck();
  return (
    <>
      <div className="row size25">
        <span className="wid90">
          Welcome, {handleLocalStorage.get(config.enums.localStorage.loginName)}!
        </span>
        <div style={{ width: "10%" }} className="right">
          {!ismobile || !open ? (
            <button onClick={() => setOpen(!open)}>
              {open ? `${config.chars.close}` : `${config.chars.hamburger}`}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NavHeaderLineInfo;
