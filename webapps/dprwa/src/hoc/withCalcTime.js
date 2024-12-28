import React from "react";
import PropTypes from "prop-types";
import ShowCompute from "../components/common/showCompute";

const WithCalcTime = component => {

    return (props) => {
        return <>
            <ShowCompute/>
            <component {...props}/>
        </>
    }
}
WithCalcTime.propTypes = {
    component: PropTypes.node
}
export default WithCalcTime