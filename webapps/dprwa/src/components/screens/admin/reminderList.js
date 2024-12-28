import React from "react";
import { config } from "../../../configs/config";
import useAPIWebWorker from "../../../hooks/useAPIWebWorker";
import GridVanila from "../../common/gridVanila";
import NoData from "../../common/nodata";

const colFunctions = {
  total_contributed_amount: (amt) => config.formatters.formatCurrency(amt),
};

const colStyles = {
  total_contributed_amount: { textAlign: "right", width: "300px" },
};


const ReminderList = (props) => {
  const urlReminders = config.endpoints.showReminders;
  const remindersData = useAPIWebWorker(urlReminders);

  if (remindersData?.loading) return <NoData text={config.messages.PLZ_WAIT} />;
  if (remindersData?.error) return <NoData text={config.messages.ERROR} />;
  return (
    <>
      <GridVanila
        title={"Members who are not contributing regularly"}
        data={remindersData.data}
        orderedColumns={["name", "phone", "total_contributed_amount"]}
        columnFunctions={colFunctions}
        columnStyle={colStyles}
      />
    </>
  );
};

export default ReminderList;
