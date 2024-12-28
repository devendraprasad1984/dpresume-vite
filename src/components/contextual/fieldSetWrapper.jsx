import React from "react";

const FieldSetWrapper = ({
                           title,
                           children
                         }) => {
  return <fieldset>
    <legend><h1>{title}</h1></legend>
    {children}
  </fieldset>;
};
export default FieldSetWrapper;