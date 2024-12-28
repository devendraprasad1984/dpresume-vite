import React from "react";
import NavLink from "../core/navLink";
import config from "../config";

const Invoice=props=>{
  let company = "Lufthansa"
  let amount = config.formatters.euroCurrencyFormatter(43271.02)
  let date = '01/06/2021'

  return <>
    <div>checkMark Invoice Paid</div>
    <div className='size10 wid40 marginU40'>
      The invoice from
      <span className='bl'> {company} </span>
      for the amount of
      <span className='bl'> {amount} </span>
      was paid on
      <span className='bl'> {date} </span>
    </div>
    <div className='marginU20'>
      <NavLink name={'Return to marketplace'} href={config.navLinks.home}/>
    </div>
  </>
}

export default Invoice