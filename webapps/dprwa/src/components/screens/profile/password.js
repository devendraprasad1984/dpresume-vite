import React, {useState} from 'react'
import {postDataAxios} from "../../../apis/post";
import {config} from "../../../configs/config";
import OneLinerHeader from "../../common/oneLinerHeader";
import WithConfig from "../../../hoc/withConfig";

const formEnum = {
  id: 'id',
  password: "pwd",
  isadmin: "isadmin",
  confirmPassword: "confirmPassword",
};
const initForm = {
  [formEnum.password]: "",
  [formEnum.confirmPassword]: "",
};

const Password = props => {
  const {isAdmin, userid} = props

  const [formData, setFormData] = useState(initForm);

  const resetForm = () => {
    setFormData({...initForm});
  };

  const handleOnChangeInput = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let name = e.target.name;
    let value = e.target.value;
    setFormData({...formData, [name]: value});
  }

  const handleSubmit = () => {
    const pwd = formData[formEnum.password]
    const confpwd = formData[formEnum.confirmPassword]

    if (pwd !== confpwd) {
      alert('passwords dont match')
      return
    }
    const payload = {};
    payload[config.enums.appGlobal.payloadEnums.passwordChange] = 1;
    payload[formEnum.id] = userid;
    payload[formEnum.password] = pwd;
    payload[formEnum.isadmin] = isAdmin ? 1 : 0
    postDataAxios(
      config.endpoints.postEndpointCommon,
      payload,
      ({data, success}) => {
        if (success) {
          resetForm();
        }
      }
    ).then((e) => e);
  };

  return <React.Fragment>
    <OneLinerHeader title={'Password Update'}/>
    <div className='col'>
      <label>Password</label>
      <input
        name={formEnum.password}
        placeholder="Enter password"
        required
        type="password"
        onChange={(e) => handleOnChangeInput(e)}
        value={formData[formEnum.password]}
      />
      <label>Confirm Password</label>
      <input
        name={formEnum.confirmPassword}
        placeholder="confirm password"
        required
        type="password"
        onChange={(e) => handleOnChangeInput(e)}
        value={formData[formEnum.confirmPassword]}
      />

      <button onClick={handleSubmit}>Save</button>

    </div>
  </React.Fragment>
}

export default WithConfig(Password)