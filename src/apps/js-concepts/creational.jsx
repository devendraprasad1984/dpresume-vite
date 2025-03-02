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
    <div className="bold">Modules are created to keep private scoped work and avoid memory leaks, thanks to closures. in JS, there is no access modifiers, so technical there is nothing called public or private, but using closures lexical scoping, we use it mimic public/private aspects.</div>
    <div className="bold">A workaround to keep privacy aspects, we use weekMap()</div>
    <CodeBlockComponent
      text={codeBlocks.ModuleExample()}
    />
  </div>;
};
export default Creational;
