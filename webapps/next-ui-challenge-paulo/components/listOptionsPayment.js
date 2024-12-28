import React from "react";
import config from "../config";

const ListOptionPayments = props => {
  const {optionPayments, groupName} = props

  const RowOption = props => {
    const {title, amount, optionClick} = props
    return <div className='row border pad20'>
      <label onClick={optionClick}>
        <input type='radio' value={title} name={groupName}/>
        <span>{title}</span>
      </label>
      <span>{config.formatters.euroCurrencyFormatter(amount)}</span>
    </div>
  }

  return <>
    {optionPayments && optionPayments.map((option, i) => {
      return <RowOption {...option}/>
    })}
  </>
}

export default ListOptionPayments