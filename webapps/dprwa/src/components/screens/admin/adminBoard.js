import PropTypes from "prop-types";
import React, { useState } from "react";
import OneLinerHeader from "../../common/oneLinerHeader";
import AddMembers from "./addMembers";
import AddExpenses from "./addExpenses";
// import { getRandomColor } from "../../../configs/config";
import ReminderList from "./reminderList";
import BackupForm from "./backForm";

const actionStateEnums = {
  addMember: "addMember",
  showReminder: "showReminder",
  addExpenses: "addExpenses",
  backup: "backup",
};

const AdminBoard = (props) => {
  const [actionState, setActionState] = useState("");

  const handleActionState = (type) => {
    setActionState(type);
  };

  const bgcolor = { backgroundColor: 'white', color: "black" };

  return (
    <>
      <div>
        <OneLinerHeader title={props.title} />
        <div className="row">
          <div className="col wid20">
            <button
              onClick={() => handleActionState(actionStateEnums.addMember)}
              style={actionStateEnums.addMember === actionState ? bgcolor : {}}
            >
              Add Member
            </button>
            <button
              onClick={() => handleActionState(actionStateEnums.addExpenses)}
              style={
                actionStateEnums.addExpenses === actionState ? bgcolor : {}
              }
            >
              Add Expenses
            </button>
            <button
              onClick={() => handleActionState(actionStateEnums.showReminder)}
              style={
                actionStateEnums.showReminder === actionState ? bgcolor : {}
              }
            >
              Reminders
            </button>
            <button
              onClick={() => handleActionState(actionStateEnums.backup)}
              style={actionStateEnums.backup === actionState ? bgcolor : {}}
            >
              Backup
            </button>
          </div>
          <div className="wid100 height500" style={bgcolor}>
            {actionStateEnums.addMember === actionState && <AddMembers />}
            {actionStateEnums.addExpenses === actionState && <AddExpenses />}
            {actionStateEnums.showReminder === actionState && <ReminderList />}
            {actionStateEnums.backup === actionState && <BackupForm />}
          </div>
        </div>
      </div>
    </>
  );
};
AdminBoard.propTypes = {
  title: PropTypes.string.isRequired,
};
export default React.memo(AdminBoard);
