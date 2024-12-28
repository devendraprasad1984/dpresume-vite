import React, { useState } from "react";
import GridVanila from "../../common/gridVanila";
import NoData from "../../common/nodata";
import { config } from "../../../configs/config";
import useAPIWebWorker from "../../../hooks/useAPIWebWorker";
import ExpensesActions from "./expensesActions";
import SearchExpensesGrid from "./searchExpensesGrid";
import WithConfig from "../../../hoc/withConfig";

const colStyles = {
  when: { width: "100px" },
  remarks: { width: "100%" },
  amount: { textAlign: "right", width: "100px" },
};
const colFunctions = {
  amount: (amt) => config.formatters.formatCurrency(amt),
};

const ExpensesGrid = (props) => {
  const {isAdmin} = props
  const [reload, setReload] = useState(0);
  const [searchText, setSearchText] = useState("");
  const searchSuffix = `&search=${searchText || ""}`;
  const urlExpensesOnly = config.endpoints.expensesOnly + searchSuffix;
  const expensesOnly = useAPIWebWorker(urlExpensesOnly, reload);

  if (expensesOnly?.loading) return <NoData text={config.messages.PLZ_WAIT} />;
  if (expensesOnly?.error) return <NoData text={config.messages.ERROR} />;

  return (
    <GridVanila
      title={"Expense Details"}
      data={expensesOnly.data}
      orderedColumns={["when", "remarks", "amount"]}
      columnStyle={colStyles}
      columnFunctions={colFunctions}
      style={{ height: "400px" }}
      hasAction={isAdmin || false}
      hasSearch={true}
      Search={(props) => (
        <SearchExpensesGrid
          {...props}
          setSearchText={setSearchText}
          searchText={searchText}
        />
      )}
      Actions={(props) => (
        <ExpensesActions {...props} reload={()=>setReload(x=>x+1)} />
      )}
      actionsCondition={[]}
    />
  );
};

export default WithConfig(ExpensesGrid);
