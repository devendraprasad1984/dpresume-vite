import ReduxCounterMain from "../../../apps/redux-app/main.jsx";
import ContextSampleApp from "../../../apps/context-app/main.jsx";
import SimpleForm from "../../../apps/simpleForm/simpleForm.jsx";

const HomeAppsWrapper = () => {
  return <div className="col gap2">
    <h2 className="underline bold text-primary">Sample Apps / Micro Frontends</h2>
    <div className="col pad5 gap5 mflex mcol">
      <div className="border overflow pad5">
        <div className="size20 wt600">Sample App - 1</div>
        <div className="col gap2">
          <ContextSampleApp/>
          <ReduxCounterMain/>
        </div>
      </div>
      <div className="size20 wt600">Sample App - 2</div>
      <div className="border overflow pad5"><SimpleForm/></div>
      <div className="border overflow pad5">
        <img src="/images/mf-1.webp" className="auto-image"/>
      </div>
    </div>
  </div>;
};
export default HomeAppsWrapper;