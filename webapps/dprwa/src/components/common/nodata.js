import PropTypes from "prop-types";
import React from "react";

import {config} from "../../configs/config";

export default function NoData({ text, type }) {
  const displayNoData = () => {
    return <h3>{text || config.messages.NO_DATA} </h3>;
  };
  const display404 = () => {
    return (
      <div className="xred notfound center">
        <h2 className="xblue size35">
          4<span className="xgray">0</span>4
        </h2>
        <br />
        <span>Page Not Found</span>
      </div>
    );
  };
  return <div>{type === "404" ? display404() : displayNoData()}</div>;
}
NoData.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
};
