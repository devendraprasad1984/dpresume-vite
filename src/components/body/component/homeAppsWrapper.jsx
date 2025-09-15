import ReduxCounterMain from "../../../apps/redux-app/main.jsx";
import VanilaJsRedux from "../../../apps/vanila-js-redux/vanila-js-redux.jsx";
import ContextSampleApp from "../../../apps/context-app/main.jsx";
import SimpleForm from "../../../apps/simpleForm/simpleForm.jsx";
import CounterSignal from "../../../otherStateTests/src/counterSignal.jsx";
import SignalTodos from "../../../otherStateTests/src/signalTodos.jsx";
import CounterValtio from "../../../otherStateTests/src/valtioCounter.jsx";
import ValtioTodos from "../../../otherStateTests/src/valtioTodos.jsx";

const HomeAppsWrapper = () => {
  return <div className="col gap2">
    <h2 className="underline bold text-primary">Sample Apps / Micro Frontends</h2>
    <div className="grid3x3 pad5 gap5 mflex mcol">
      <div className="border height350 overflow pad5">
        <div class="col gap2">
          <ContextSampleApp/>
          <CounterSignal/>
          <CounterValtio/>
          <ReduxCounterMain/>
        </div>
      </div>
      <div className="border height350 overflow pad5"><VanilaJsRedux/></div>
      <div className="border height350 overflow pad5"><SimpleForm/></div>
      <div className="border height350 overflow pad5">
        <div class="col gap2">
          <SignalTodos/>
          <ValtioTodos/>
        </div>
      </div>
      <div className="border height350 overflow pad5">
        <a href="images/microfrontend1.jpeg" target="_blank">
          <img src="images/microfrontend1.jpeg" className="auto-image"/>
        </a>
      </div>
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