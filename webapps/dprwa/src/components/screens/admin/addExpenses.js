import React, { useState } from "react";
import { postData, postDataAxios } from "../../../apis/post";
import {config, handleLocalStorage} from "../../../configs/config";

const formEnum = {
  amount: "amount",
  reason: "reason",
};
const initForm = {
  [formEnum.amount]: "",
  [formEnum.reason]: "",
};

const AddExpenses = (props) => {
  const [formData, setFormData] = useState(initForm);

  const handleOnChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveExpenses = () => {
    let payload = { saveExpense: 1, ...formData,adminid: handleLocalStorage.get(config.enums.localStorage.userid) };
    postData(
      config.endpoints.postEndpointCommon,
      payload,
      ({ data, success }) => {
        if (success) {
          alert("saved");
        }
      }
    ).then((e) => e);
  };

  return (
    <>
      <div className="column pad10">
        <label htmlFor={formEnum.reason}>Where it was spent on?</label>
        <input
          name={formEnum.reason}
          placeholder="Reason: where this money is spent on"
          type="text"
          onChange={(e) => handleOnChangeInput(e)}
          value={formData[formEnum.reason]}
        />

        <label>Amount</label>
        <input
          name={formEnum.amount}
          placeholder="enter amount"
          type="number"
          style={{ width: "150px" }}
          onChange={(e) => handleOnChangeInput(e)}
          value={formData[formEnum.amount]}
        />
        <div className="right">
          <button onClick={handleSaveExpenses}>Save Expenses</button>
        </div>
      </div>
    </>
  );
};

export default AddExpenses;
