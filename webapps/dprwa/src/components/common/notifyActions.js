import React from "react";

const NotifyActions = (props) => {
  const {} = props;

  const handleNotifyWA = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <a href="#" className="info" onClick={(e) => handleNotifyWA(e)}>
        Notify
      </a>
    </>
  );
};

export default NotifyActions;
