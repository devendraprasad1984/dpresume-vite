import Industry from "./industry.jsx";
import Skills from "./skills.jsx";
import LiveApps from "./liveApps.jsx";
import Community from "./community.jsx";

const panels = [LiveApps, Community, Skills, Industry];

const Right = () => {
  return <div className="col gap10">
    {panels.map((Panel, index) => (
      <div key={Panel.name} className="reveal" style={{"--stagger": index + 1}}>
        <Panel/>
      </div>
    ))}
  </div>;
};

export default Right;
