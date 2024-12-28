import PropTypes from "prop-types";
import React from "react";
import '../../css/input.css'

const Input = (props) => {
    const {label, type, placeholder, required} = props;
    return (
        <div className="input-wrapper">
            <input
                type={type || "text"}
                required={required}
                className="form-control"
                placeholder={placeholder || ""}
                {...props}
            />
            <label htmlFor="input" className="control-label">{label}</label>
        </div>
    );
};
Input.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
};

export default Input;
