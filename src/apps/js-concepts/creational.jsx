import React from "react";
import CodeBlockComponent from "../../components/contextual/codeBlock.jsx";
import codeBlocks from "../../core/codeBlocks.js";

const Creational = () => {
  return <div>
    <div className="bold">Creational design pattern</div>
    <CodeBlockComponent
      text={codeBlocks.createObjectVanilla()}
    />
    <CodeBlockComponent
      text={codeBlocks.createObjectClass()}
    />
    <CodeBlockComponent
      text={codeBlocks.ModuleExample()}
    />
  </div>;
};
export default Creational;
