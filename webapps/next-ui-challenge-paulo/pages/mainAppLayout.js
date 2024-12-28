import PageHeader from "../core/PageHeader";
import TransactionSummary from "../components/transactionSummary";
import React from "react";

export default function MainAppLayout({children}) {
  return (
    <div className={["textColor"].join(" ")}>
      <PageHeader/>

      <div className={["row"].join(' ')}>
        <div className='wid40 leftPanel pad20'><TransactionSummary/></div>
        <div className='wid60 mainAppContainer pad20'>
          {children}
        </div>
      </div>
    </div>
  );
}
