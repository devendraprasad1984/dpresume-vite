import React from "react";
import OneLinerHeader from "../../common/oneLinerHeader";
import MonthlyExpenses from "./monthly";
import ExpensesGrid from "./expensesGrid";

export default (props) => {
  return (
    <>
      <OneLinerHeader title={props.title} />
      <MonthlyExpenses />
      <ExpensesGrid />
    </>
  );
};
