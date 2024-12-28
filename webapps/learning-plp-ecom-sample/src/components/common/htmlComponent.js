import PropTypes from "prop-types";
import React from "react";

import {config} from "../../configs/config";

const HtmlComponent = ({ text }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: `${config.chars.pointArrow} ${text}` }}
    />
  );
};
HtmlComponent.propTypes = {
  text: PropTypes.string.isRequired,
};

export default HtmlComponent;
