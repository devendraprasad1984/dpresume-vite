import React from "react";
import { CopyBlock, dracula } from "react-code-blocks";

const CodeBlockComponent = ({
  text = "Sample component",
  language = "javascript"
}) => {
  return <div className="demo">
    <CopyBlock
    text={text}
    theme={dracula}
    language={language}
    showLineNumbers
    codeBlock
    wrapLines
  />
  </div>;
};
export default CodeBlockComponent;