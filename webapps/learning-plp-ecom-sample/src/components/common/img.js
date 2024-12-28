import React from "react";
import PropTypes from "prop-types";


const Image=props=>{
    const {src,className}=props
    return <img className={className} src={src} alt=''/>
}
Image.propTypes={
    src: PropTypes.string.isRequired,
    className: PropTypes.string
}
export default Image