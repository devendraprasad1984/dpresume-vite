import {postData} from "../../../apis/post";
import {config} from "../../../configs/config";
import React from "react";

const ExpensesActions = (props) => {
  const {row, reload} = props;
  const handleDeleteExpenses = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("row clicked", row);
    const {id, amount} = row;
    postData(
      config.endpoints.postEndpointCommon,
      {deleteExpense: 1, id},
      ({data, success}) => {
        if (success) {
          reload({amount: -parseFloat(amount)});
        }
      }
    );
  };

  return (
    <React.Fragment>
      <a href="#" className="danger" onClick={(e) => handleDeleteExpenses(e)}>
        Delete
      </a>
    </React.Fragment>
  );
};

export default ExpensesActions;
