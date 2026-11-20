import CodeBlockComponent from "../../components/contextual/codeBlock.jsx";
import designPatterns from "../../core/designPatterns.js";

const DesignPatterns = () => {
  return <div className="col gap10">
    {designPatterns.map((group) => (
      <div key={group.category} className="col gap5">
        <div className="bold size18">{group.category} design patterns</div>
        {group.patterns.map((pattern) => (
          <div key={pattern.name}>
            <div className="bold text-primary">{pattern.name}</div>
            <div>{pattern.note}</div>
            <CodeBlockComponent text={pattern.code.trim()}/>
          </div>
        ))}
      </div>
    ))}
  </div>;
};
export default DesignPatterns;
