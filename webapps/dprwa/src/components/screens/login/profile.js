import PropTypes from "prop-types";
import React, {useState} from "react";
import OneLinerHeader from "../../common/oneLinerHeader";
import {config, handleLocalStorage} from "../../../configs/config";
import {useHistory} from "react-router-dom";
import Password from "../profile/password";


const actionStateEnums = {
  password: "password",
};


const logoutCleanup = (callback) => {
  handleLocalStorage.remove(config.enums.localStorage.name);

  callback()
}


const Profile = (props) => {
  const {title} = props;
  const history = useHistory();
  const [actionState, setActionState] = useState("");

  const handleActionState = (type) => {
    setActionState(type);
  };


  const handleLogout = () => {
    try {
      logoutCleanup(() => {
        history.push("/login");
        history.go(0);
      })
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <div>
        <OneLinerHeader title={title}/>
        <button onClick={() => handleActionState(actionStateEnums.password)}
        >Password Update
        </button>
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="wid60">
        {actionStateEnums.password === actionState && <Password/>}
      </div>
    </React.Fragment>
  );
};
Profile.propTypes = {
  title: PropTypes.string.isRequired,
};
export default React.memo(Profile);
