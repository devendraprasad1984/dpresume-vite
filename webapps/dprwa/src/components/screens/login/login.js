import React, { useState } from "react";
import PropTypes from "prop-types";
import { config, handleLocalStorage } from "../../../configs/config";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  const history = useHistory();

  const { title, close } = props;
  const [name, setName] = useState("mate");

  const handleAdminCheck = () => {};

  const handleOnClickProceed = () => {
    close(name);
  };

  const handleCloseWelcome = () => {
    handleLocalStorage.set(config.enums.localStorage.name, name);
    history.push("/" + config.routes.home);
    history.go(0);
  };

  return (
    <div className="wid30 child-center">
      <div className="size30">{title}</div>

      <div className="column">
        <input placeholder="admin name" type="text" />
        <input placeholder="admin password" type="password" />

        <div className="row">
          <button className="one" onClick={handleAdminCheck}>
            Login
          </button>
        </div>
      </div>

      <div>
        <button className="two" onClick={handleCloseWelcome}>
          Proceed now
        </button>
      </div>
    </div>
  );
};
Login.propTypes = {
  title: PropTypes.string,
  close: PropTypes.func,
};
export default React.memo(Login);
