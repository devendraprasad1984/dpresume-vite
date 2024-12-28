import React from "react";

export default function Button(props) {
    const {val, icon, onclick, classname, style} = props
    const btn = <button className={'btn ' + classname} style={style} onClick={onclick}>{val}</button>
    const ibtn = <button className={'icon ' + classname} style={style} onClick={onclick}>{val}</button>

    return icon !== undefined ? ibtn : btn
}
