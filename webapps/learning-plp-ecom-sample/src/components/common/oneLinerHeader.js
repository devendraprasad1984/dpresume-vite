import PropTypes from "prop-types";
import React from "react";

const OneLinerHeader = (props) => {
  return <h1>{props.title}</h1>;
};

export default OneLinerHeader;

OneLinerHeader.propTypes = {
  title: PropTypes.string,
};
