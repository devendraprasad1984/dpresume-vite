import React from "react";


const AppInput = props => {
    const {value, onchange, placeholder, style, className} = props

    return <div>
        <input
            placeholder={placeholder}
            value={value}
            onChange={onchange}
            style={style}
            className={className}
        />
    </div>
}

export default AppInput
