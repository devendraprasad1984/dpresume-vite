import React, {useState} from "react";
import {config} from "../../../configs/config";
import "../../styles/memberInfo.css";
import BaseModal from "../../common/baseModal";
import MemberContributionForm from "./memberContributionForm";
import WithConfig from "../../../hoc/withConfig";
import MemberContributionList from "./memberContributionList";

const MemberInfo = (props) => {
  const {memberInfo, isAdmin, setCardAmount} = props;
  const [reload, setReload] = useState(0);
  const {id, name, type, memkey, amount, when} = memberInfo;
  const [pageAmount, setPageAmount] = useState(parseFloat(amount));


  const incrementReloadCounter = ({amount}) => {
    setReload(prev => prev + 1)
    setPageAmount(prev => parseFloat(prev) + parseFloat(amount))
    setCardAmount(prev => parseFloat(prev) + parseFloat(amount))
  }

  const iprops = {
    id: id,
    reload: incrementReloadCounter,
    reloadCounter: reload
  }

  return (
    <>
      <BaseModal {...props} title={`${name.toString().toUpperCase()}`}>
        <div className="row size12">
          <span>{memkey}</span>
          <span>{type}</span>
          <span>{when}</span>
          <span className='size20 bl'>{config.formatters.formatCurrency(pageAmount)}</span>
        </div>
        <MemberContributionForm {...iprops}/>
        <MemberContributionList {...iprops}/>
      </BaseModal>
    </>
  );
};

export default WithConfig(MemberInfo);
