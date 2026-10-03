import ReduxCounterMain from "../../../apps/redux-app/main.jsx";
import ContextSampleApp from "../../../apps/context-app/main.jsx";
import SimpleForm from "../../../apps/simpleForm/simpleForm.jsx";
import architectureComparison from "../../../core/architectureComparison.js";

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
        <div className="dp-compare">
          {architectureComparison.map((item) => (
            <article key={item.id} className={`dp-compare__card dp-compare__card--${item.tone} reveal hover-lift`}>
              <h4 className="dp-compare__title">{item.title}</h4>
              <p className="dp-compare__tagline">{item.tagline}</p>

              <p className="dp-compare__label dp-compare__label--pro">Strengths</p>
              <ul className="dp-compare__list dp-compare__list--pro">
                {item.strengths.map((point) => <li key={point}>{point}</li>)}
              </ul>

              <p className="dp-compare__label dp-compare__label--con">Trade-offs</p>
              <ul className="dp-compare__list dp-compare__list--con">
                {item.tradeoffs.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <p className="dp-compare__verdict">
          <strong>In practice:</strong> stay a monolith until deploy contention, team count or
          domain boundaries make the shared release train the bottleneck. Micro frontends buy
          autonomy, and you pay for it in infrastructure.
        </p>
      </div>
    </div>
  </div>;
};
export default HomeAppsWrapper;