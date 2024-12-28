import React from "react";
import NavLink from "../core/navLink";
import config from "../config";
import ListRadioButtons from "./listRadioButtons";

const Payments = props => {
  const radioOptions=[
    {title: 'Bank Transfer', click: ()=>{}, selected: true},
    {title: 'pay by Bank', click: ()=>{}},
    {title: 'Credit Card', click: ()=>{}},
    {title: 'IDEAL', click: ()=>{}}
  ]

  return <>
    <div>Your Payment</div>
    <div className='marginU20 wid60 size12'>
      <div className='row wid50'>
        <div className='column'>
          <span>Net Term</span>
          <span>30 days</span>
        </div>
        <div className='column'>
          <span>Due Date</span>
          <span>20/05/2021</span>
        </div>
      </div>

      <hr/>

      <div className='marginU20'>
        <span>Your payment</span>
        <div className='margin10 row'>
          <ListRadioButtons options={radioOptions} groupName='paymentOptions'/>
        </div>

        <div className='row space'>
          <div className='column wid60'>
            <span>Label</span>
            <input type="text" value='1234 4567 8901 1112'/>
          </div>
          <div className='column wid20'>
            <span>Label</span>
            <input type="date" value='01/28'/>
          </div>

          <div className='column wid20'>
            <span>Label</span>
            <input type="number" value='123'/>
          </div>
        </div>

        <div className='margin10 row'>
          <div className='column'>
            <span>Label</span>
            <input type="text" value='C Hancock'/>
          </div>
          <div className='column'>
            <span>Label</span>
            <select>
              <option value="Neitherlands">Neitherlands</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
            </select>
          </div>
        </div>

      </div>
    </div>
    <div className='marginU20'>
      <NavLink name={'Confirm Payment'} href={config.navLinks.checkoutInvoice}/>
    </div>
  </>
}

export default Payments