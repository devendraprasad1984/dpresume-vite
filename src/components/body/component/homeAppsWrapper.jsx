import React from "react";
import ReduxCounterMain from "../../../apps/redux-app/main.jsx";
import VanilaJsRedux from "../../../apps/vanila-js-redux/vanila-js-redux.jsx";
import ContextSampleApp from "../../../apps/context-app/main.jsx";
import SimpleForm from "../../../apps/simpleForm/simpleForm.jsx";

const HomeAppsWrapper = () => {
  return <div className="col gap2">
    <h2 className="underline bold text-primary">Sample Apps</h2>
    <div className="border grid3x3 pad5 gap5 mflex mcol">
      <div className="border height350 overflow pad5"><ReduxCounterMain/></div>
      <div className="border height350 overflow pad5"><VanilaJsRedux/></div>
      <div className="border height350 overflow pad5"><ContextSampleApp/></div>
      <div className="border height350 overflow pad5"><SimpleForm/></div>
      <div className="border height350 overflow pad5">app1</div>
      <div className="border height350 overflow pad5">app2</div>
      <div className="border height350 overflow pad5">app3</div>
      <div className="border height350 overflow pad5">app4</div>
      <div className="border height350 overflow pad5">app1</div>
      <div className="border height350 overflow pad5">app2</div>
      <div className="border height350 overflow pad5">app3</div>
      <div className="border height350 overflow pad5">app4</div>
    </div>
  </div>;
};
export default HomeAppsWrapper;