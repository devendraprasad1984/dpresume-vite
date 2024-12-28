import React from "react";
import GridVanila from "../../common/gridVanila";
import NoData from "../../common/nodata";
import { config } from "../../../configs/config";
import useAPIWebWorker from "../../../hooks/useAPIWebWorker";

const colStyles = {
  remarks: { width: "70%" },
  amount: { textAlign: "right" },
};

const colFunctions = {
  amount: (amt) => config.formatters.formatCurrency(amt),
};

const MonthlyExpenses = (props) => {
  const urlExpensesByMonth = config.endpoints.expensesByMonth;
  const expensesByMonth = useAPIWebWorker(urlExpensesByMonth);

  if (expensesByMonth?.loading)
    return <NoData text={config.messages.PLZ_WAIT} />;
  if (expensesByMonth?.error) return <NoData text={config.messages.ERROR} />;

  return (
    <GridVanila
      title={"Monthly Breakup"}
      data={expensesByMonth.data}
      orderedColumns={["date", "remarks", "amount"]}
      columnStyle={colStyles}
      columnFunctions={colFunctions}
      style={{ height: "200px" }}
    />
  );
};

export default MonthlyExpenses;
