import React, {useState} from "react";
import WithConfig from "../../../hoc/withConfig";
import Periods from "./periods";
import {postData} from "../../../apis/post";
import {config} from "../../../configs/config";


const formEnum = {
  time: "time",
  amount: "amount",
  remarks: "remarks",
};
const initForm = {
  [formEnum.time]: "",
  [formEnum.amount]: "",
  [formEnum.remarks]: "",
};


const MemberContributionForm = (props) => {
  const {isAdmin, id, reload} = props
  const [form, setForm] = useState(initForm)

  const resetForm = () => {
    setForm({...initForm});
  };

  const handleSaveContribution = () => {
    let payload = {};
    payload["saveContribution"] = 1;
    payload["memid"] = id;
    payload["time"] = form[formEnum.time];
    payload["amount"] = form[formEnum.amount];
    payload["remarks"] =
      form[formEnum.remarks] === ""
        ? "regular maintenance"
        : form[formEnum.remarks];

    postData(
      config.endpoints.postEndpointCommon,
      payload,
      ({data, success}) => {
        if (success) {
          resetForm();
          reload({amount: payload.amount})
        }
      }
    ).then((e) => e);
  }

  const handleChange = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let {name, value} = e.target
    setForm({...form, [name]: value})
  }

  const holdTimePeriod = (name, value) => {
    setForm({...form, [name]: value})
  }

  if (!isAdmin) return null
  return (
    <React.Fragment>
      <div className="size15">
        Add Contribution for this month / Reversal (enter amount using minus
        sign)
      </div>

      <div className="row">
        <Periods onchange={(value) => holdTimePeriod(formEnum.time, value)}/>
        <input
          name={formEnum.amount}
          value={form[formEnum.amount]}
          className="input-right amount wid40"
          placeholder="enter your amount"
          type="number"
          onChange={handleChange}
        />
        <input
          name={formEnum.remarks}
          value={form[formEnum.remarks]}
          placeholder="eg regular maintenance"
          type="text"
          onChange={handleChange}
          className="wid100"
        />
        <div className="right">
          <button className="primary" onClick={handleSaveContribution}>Save</button>
        </div>
      </div>

      <div className="column">
        <div className="margin-ud">
          Free flow text / auto generated message to be sent over to whatsapp
        </div>
        <textarea className="pad10 size20 wid100" rows={5}></textarea>
        <div className="right">
          <button className="secondary">Send to WA</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default WithConfig(MemberContributionForm);
