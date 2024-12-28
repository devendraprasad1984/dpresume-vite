import React from "react"
import '../../css/button.css'

const Button = props => {
    const {click, val,icon, btnClass} = props
    let iconObj=<span className="icons">{icon}</span>
    const normalButton=<a className={`btn riple click ${btnClass}`} onClick={click}>{iconObj} {val}</a>
    const iconButton=<a className={`btn riple click ${btnClass}`} onClick={click}>{val}</a>
    return <span>{icon !== undefined ? normalButton : iconButton}</span>
}

export default React.memo(Button)