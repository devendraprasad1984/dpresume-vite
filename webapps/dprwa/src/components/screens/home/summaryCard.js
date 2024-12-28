import React, {useState} from "react";
import OneLinerHeader from "../../common/oneLinerHeader";
import {config} from "../../../configs/config";
import get from "../../../apis";
import NoData from "../../common/nodata";

const SummaryCard = (props) => {
  const {summaryInfoData, url} = props;
  const [summaryInfo, setSummaryInfo] = useState(summaryInfoData)
  const [loading, setLoading] = useState(false)
  let credit, debit, members;

  const handleSummaryRefresh = () => {
    setLoading(true)
    let urlSummaryOnly = url + `&summaryOnly=1`

    get(urlSummaryOnly, (res) => {
      setSummaryInfo(res.data)
      setLoading(false)
    })

  }

  const Title = () => {
    return <React.Fragment>
      <div className='row'>
        <span>Summary</span>
        <a href='#' className='xsuccess size12' onClick={handleSummaryRefresh}>Refresh</a>
      </div>
    </React.Fragment>
  }

  if (loading) return <NoData text={config.messages.PLZ_WAIT}/>
  return (
    <React.Fragment>
      <div className="cards height200 pad10">
        <OneLinerHeader title={<Title/>}/>
        {summaryInfo.map((summary) => {
          let isMemberCount = summary.id === config.enums.appGlobal.exclusiveKeys[2]
          if (summary.id === config.enums.appGlobal.exclusiveKeys[0]) {
            credit = summary.amount;
          }
          if (summary.id === config.enums.appGlobal.exclusiveKeys[1]) {
            debit = Math.abs(summary.amount);
          }
          if (isMemberCount) {
            members = summary.amount;
          }
          return (
            <div key={summary.id} className="column">
              <div className="row">
                <span className="bl">{summary.id}</span>
                <span className="size15">
                  {!isMemberCount ? config.formatters.formatCurrency(Math.abs(summary.amount)) : members}
                </span>
              </div>
            </div>
          );
        })}
        <div className={`bl right ${credit - debit < 0 ? "xred" : "xsuccess"}`}>
          Balance:{" "}
          {config.formatters.formatCurrency(Number(credit) - Number(debit))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default SummaryCard;
