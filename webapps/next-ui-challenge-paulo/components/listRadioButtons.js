import React from "react";

const ListRadioButtons = props => {
  const {options, groupName} = props

  const RowOption = props => {
    const {title, click, selected} = props
    return <div className="radioButtonControl" onClick={click}>
      <input type="radio" id={title} name={groupName} value={title}/>
      <label htmlFor={title}>{title}</label>
    </div>

  }

  return <>
    {options && options.map((option, i) => {
      return <RowOption {...option}/>
    })}
  </>
}

export default ListRadioButtons