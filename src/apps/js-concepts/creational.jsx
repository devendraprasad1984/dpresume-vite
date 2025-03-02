import React from "react";
import CodeBlockComponent from "../../components/contextual/codeBlock.jsx";

const Creational = () => {
  return <div>
    <div className="bold">Creational design pattern</div>
    <CodeBlockComponent
      language="javascript"
      text={`function toBe() {
                if (Math.random() < 0.5) {
                  return true;
                } else {
                  return false;
                }
        }`}
    />
  </div>;
};
export default Creational;
