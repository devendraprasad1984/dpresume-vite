import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import JSONPretty from "react-json-pretty";
import OneLinerHeader from "../../common/oneLinerHeader";

const ShowAuth0Info = (props) => {
  const auth0Content = useSelector((_) => _.Auth0);
  return (
    <div>
      <OneLinerHeader title={props.title} />
      <div className="row wrap">
        <JSONPretty data={auth0Content} />
      </div>
    </div>
  );
};

ShowAuth0Info.propTypes = {
  title: PropTypes.string,
};

export default ShowAuth0Info;
