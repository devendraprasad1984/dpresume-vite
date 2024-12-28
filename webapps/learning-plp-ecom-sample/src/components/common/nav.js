import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";

import {config} from "../../configs/config";

import NoData from "./nodata";

const Nav = (props) => {
  const homeComponent= config.menu.filter(row=>row.name.toLowerCase()==='home')[0]
  const makeAppRoutes = () => {
    return config.menu.map((item, index) => {
      let path = "/" + item.name.toLowerCase();
      let routekey = "route-item-" + index;
      if (item.component === undefined)
        return (
          <Route key={routekey} path={path}>
            <NoData type="404" />
          </Route>
        );
      return (
        <Route key={routekey} path={path}>{item.component}</Route>
      );
    });
  };
  return (
    <div>
      <HashRouter>
        <div className="margin-ud">
            <Switch>
              <Route exact path={'/'}>{homeComponent.component}</Route>
              {makeAppRoutes()}
            </Switch>
        </div>
      </HashRouter>
    </div>
  );
};

export default Nav;
