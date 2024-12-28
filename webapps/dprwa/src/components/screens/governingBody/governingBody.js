import React from "react";
import GridVanila from "../../common/gridVanila";
import NoData from "../../common/nodata";
import { config } from "../../../configs/config";
import useAPI from "../../../hooks/useAPI";
import OneLinerHeader from "../../common/oneLinerHeader";
import NotifyActions from "../../common/notifyActions";

const colStyles = {
  remarks: { width: "70%" },
  amount: { textAlign: "right" },
};

const GoverningBody = (props) => {
  const url = config.endpoints.governingBody;
  const governingBody = useAPI(url);

  if (governingBody?.loading) return <NoData text={config.messages.PLZ_WAIT} />;
  if (governingBody?.error) return <NoData text={config.messages.ERROR} />;

  return (
    <>
      <OneLinerHeader title={props.title} />
      <GridVanila
        title={"Executive Committee Members"}
        data={governingBody.data}
        columnStyle={colStyles}
        style={{ height: "400px" }}
        hasAction={true}
        Actions={(props) => <NotifyActions {...props} />}
        actionsCondition={[]}
      />
    </>
  );
};

export default GoverningBody;
