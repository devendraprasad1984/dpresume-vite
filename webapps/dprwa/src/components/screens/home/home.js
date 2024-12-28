import PropTypes from "prop-types";
import React, {useState} from "react";

import {config, handleLocalStorage} from "../../../configs/config";
import NoData from "../../common/nodata";
import OneLinerHeader from "../../common/oneLinerHeader";
import useAPIWebWorker from "../../../hooks/useAPIWebWorker";
import MemberCard from "./memberCard";
import SummaryCard from "./summaryCard";
import SearchMember from "./searchMember";
import WithConfig from "../../../hoc/withConfig";

const Home = (props) => {
  const {title, isAdmin} = props;
  const defaultFilterTyp = handleLocalStorage.get(config.enums.appGlobal.homefilter) || config.enums.appGlobal.byname
  const [type, setType] = useState(defaultFilterTyp);
  const [searchText, setSearchText] = useState("");

  const url =
    config.endpoints.EXPENSES_GROUP + `&search=${searchText}&${type}=1`;

  const FilterActionButtons = () => {
    return (
      <div className="right wid100 pad5">
        <span>Show By: </span>
        <button className="info" onClick={handleByName}>
          Name
        </button>
        <button className="danger" onClick={handleByAmount}>
          Amount
        </button>
        <button onClick={handleByAddress}>Address</button>
      </div>
    );
  };

  const Title = () => {
    return (
      <>
        <div className="row size20">
          <span>{title}</span>
          <span className="xinfo">
            {data.length -
              config.enums.appGlobal.exclusiveKeys.length +
              " members"}
          </span>
        </div>
      </>
    );
  };

  const {data, loading, error} = useAPIWebWorker(url);
  if (loading || !data) return <NoData text={config.messages.PLZ_WAIT}/>;
  if (error) return <NoData text={config.messages.ERROR}/>;

  const summaryInfo = data.filter((row) =>
    config.enums.appGlobal.exclusiveKeys.indexOf(row.id) !== -1 ? true : false
  );

  const handleByName = () => {
    let val = config.enums.appGlobal.byname
    handleLocalStorage.set(config.enums.appGlobal.homefilter, val)
    setType(val);
  };
  const handleByAmount = () => {
    let val = config.enums.appGlobal.byamount
    handleLocalStorage.set(config.enums.appGlobal.homefilter, val)
    setType(val);
  };
  const handleByAddress = () => {
    let val = config.enums.appGlobal.byaddress
    handleLocalStorage.set(config.enums.appGlobal.homefilter, val)
    setType(val);
  };

  return (
    <React.Fragment>
      <OneLinerHeader title={<Title/>}/>
      <SearchMember searchText={searchText} setSearchText={setSearchText}/>
      <FilterActionButtons/>
      <div className="flexboxAutoFit">
        <SummaryCard summaryInfoData={summaryInfo} url={url}/>
        {data.length !== 0 &&
          data.map((row) => {
            if (config.enums.appGlobal.exclusiveKeys.includes(row.id)) return;
            return (
              <div key={row.id}>
                <MemberCard
                  memberDetail={row}
                  isAdmin={isAdmin}
                />
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
};
Home.propTypes = {
  title: PropTypes.string.isRequired,
};
Home.defaultProps = {
  title: "home",
};

export default WithConfig(Home);
