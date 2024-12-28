import React from "react";
import ListOptionPayments from "./listOptionsPayment";
import NavLink from "../core/navLink";
import config from "../config";

const ItemsEMIsMarketPlace = props => {
  const optionPayments = [
    {title: '1 payment due', amount: 413217.02},
    {title: '2 payment due', amount: 21635.51},
    {title: '3 payment due', amount: 14423.67}
  ]
  return <>
    <div className='column pad20'>
      <span>Choose your items</span>
      <div className='wid60'>
        <ListOptionPayments
          groupName='term'
          optionPayments={optionPayments}
        />
      </div>
      <div>
        <NavLink name={'Continue'} href={config.navLinks.checkoutPayments}/>
      </div>
    </div>
  </>
}

export default ItemsEMIsMarketPlace