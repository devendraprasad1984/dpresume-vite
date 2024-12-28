import React, {useCallback, useState} from "react";
import {HashRouter, NavLink, Route, Switch} from "react-router-dom";
import {config, getRandomColor, mobileCheck} from "../../configs/config";
import Home from "../screens/home/home";

import NoData from "./nodata";
import NavHeaderLineInfo from "../screens/navHeaderInfoLine";
import WithConfig from "../../hoc/withConfig";

const Nav = (props) => {
  const {isAdmin} = props
  const ismobile = mobileCheck();
  const [open, setOpen] = useState(!ismobile);
  const isLogin = config.utils.isLogin();
  const [bgColor, setBgColor] = useState(getRandomColor());

  const linkClickPreHandler = () => {
    let randomBgcolor = getRandomColor() || "white";
    setBgColor((_) => randomBgcolor);

    if (!ismobile) return;
    setOpen(!open);
  };
  const displayMenu = useCallback(() => {
    if (config.utils.isLogin()) return null;
    return config.menu.map((item, index) => {
      if (item.show === false) return null;
      // let isHome = window.location.hash === '#/' && item.name.toLowerCase() === 'home'
      let decodedHash = decodeURI(window.location.hash);
      let isItemCurrent = decodedHash.indexOf(item.name.toLowerCase()) !== -1;
      let activeParentClass = isItemCurrent ? "active-parent" : "";


      if (item.isBehindAdmin === true && isAdmin === false) return null
      return (
        <span
          key={"menu-item-" + index}
          className={
            "pad10 size15 margin-ud " +
            activeParentClass +
            " " +
            (ismobile ? "xwhite" : "")
          }
        >
          <NavLink
            exact={true}
            activeClassName="active"
            to={"/" + item.name.toLowerCase()}
            onClick={linkClickPreHandler}
          >
            {item.name}
          </NavLink>
        </span>
      );
    });
  }, []);

  const generateRoutes = useCallback(() => {
    return config.menu.map((item, index) => {
      let path = "/" + item.name.toLowerCase();
      let routekey = "route-item-" + index;
      if (item.component === undefined)
        return (
          <Route key={routekey} path={path}>
            <NoData type="404"/>
          </Route>
        );
      return (
        <Route key={routekey} path={path}>
          {item.component}
        </Route>
      );
    });
  }, []);

  return (
    <div>
      {!isLogin ? <NavHeaderLineInfo open={open} setOpen={setOpen}/> : null}
      <HashRouter>
        <div
          id="bggif"
          className="row h100 bggif"
          // style={{ backgroundColor: bgColor }}
        >
          {open && (
            <div className="flex1 content-left">
              {ismobile && (
                <div className="row">
                  <span
                    className="right  bl size35 padding-rl"
                    onClick={() => setOpen(!open)}
                  >
                    {open
                      ? `${config.chars.close}`
                      : `${config.chars.hamburger}`}
                  </span>
                </div>
              )}

              <div className="col">
                {/*<img className="imgPic img-animate" src={dp} alt={"dp"}/>*/}
                {/*<LoginWithAuth0 />*/}
              </div>
              <div className="col h100">{displayMenu()}</div>
              {/*<div className="sidePicLeft">&nbsp;</div>*/}
            </div>
          )}

          <div className="content-right ">
            <Switch>
              <Route exact path={"/"}>
                <Home title={config.pageTitles.home}/>
              </Route>
              {generateRoutes()}
            </Switch>
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default React.memo(WithConfig(Nav));
