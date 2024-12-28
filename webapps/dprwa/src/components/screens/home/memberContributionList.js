import React from 'react'
import GridVanila from "../../common/gridVanila";
import ExpensesActions from "../expenseViews/expensesActions";
import {config} from "../../../configs/config";
import useAPIWebWorker from "../../../hooks/useAPIWebWorker";
import NoData from "../../common/nodata";
import WithConfig from "../../../hoc/withConfig";

const colFunctions = {
  amount: (amt) => config.formatters.formatCurrency(amt),
};


const MemberContributionList = props => {
  const {id, isAdmin, reload, reloadCounter} = props;

  const url = config.endpoints.expensesByMember + `&id=${id}`;

  const {data, loading, error} = useAPIWebWorker(url, reloadCounter);
  if (loading || !data) return <NoData text={config.messages.PLZ_WAIT}/>;
  if (error) return <NoData text={config.messages.ERROR}/>;

  return <React.Fragment>
    <div>
      <GridVanila
        data={data}
        orderedColumns={["date", "amount", "remarks", "when"]}
        columnFunctions={colFunctions}
        hasAction={isAdmin || false}
        Actions={(props) => (
          <ExpensesActions {...props} reload={reload}/>
        )}
      />
    </div>

  </React.Fragment>
}
export default WithConfig(MemberContributionList)