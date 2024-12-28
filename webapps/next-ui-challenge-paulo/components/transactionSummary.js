import React from "react";
import config from "../config";

const TransactionSummary = props => {
  return <>
    <div className='column wid50 margin20'>
      <span>Transaction Summary</span>

      <div className='column marginU30'>
        <label>Amount</label>
        <div className='row'>
          <span className="size20">{config.symbols.euro} 430.02</span>
          <button className='bggreen textColor'>Open</button>
        </div>
      </div>

      <div className='column marginU30'>
        <label>Recipient</label>
        <span>Corp.co mail phone icons</span>
      </div>

      <div className='column marginU30'>
        <label>Invoice</label>
        <span>#2021-95674</span>
      </div>

      <div className='column marginU30'>
        <label>PO Number</label>
        <span>89173419620</span>
      </div>

      <div className='column marginU30'>
        <button>Download Invoice</button>
      </div>

      <div className='column marginU40'>
        <span>Do you dispute this transaction?</span>
        <button className='bgwhite textColor'>Open a dispute</button>
      </div>
    </div>
  </>
}

export default TransactionSummary