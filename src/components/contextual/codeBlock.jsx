import React from "react";
import { CopyBlock, paraisoLight } from "react-code-blocks";

const CodeBlockComponent = ({
  text = "Sample component",
  language = "javascript"
}) => {
  return <div className="demo">
    <CopyBlock
      text={text}
      theme={paraisoLight}
      language={language}
      showLineNumbers
      codeBlock
      wrapLines
    />
    <br/>
  </div>;
};
export default CodeBlockComponent;