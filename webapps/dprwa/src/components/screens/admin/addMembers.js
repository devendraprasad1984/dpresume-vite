import React, {useEffect, useState} from "react";
import {config} from "../../../configs/config";
import {postDataAxios} from "../../../apis/post";

const formEnum = {
  name: "name",
  address: "address",
  memberId: "memberId",
  addressSort: "addressSort",
  memberType: "memberType",
  memkey: "memkey",
  memid: "memberid",
  address_number_sort: "address_number_sort",
  type: "type"
};
const initForm = {
  [formEnum.name]: "",
  [formEnum.address]: "",
  [formEnum.memberId]: "",
  [formEnum.addressSort]: "",
  [formEnum.memberType]: "member",
};

const AddMembers = (props) => {
  const {editMode = false, memberInfo = {}} = props;

  const [formData, setFormData] = useState(initForm);

  const resetMemberForm = () => {
    setFormData({...initForm});
  };

  const handleOnChangeInput = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let name = e.target.name;
    let value = e.target.value;
    setFormData({...formData, [name]: value});
  };

  const handleSubmitMember = () => {
    let phone = formData[formEnum.memberId];
    let phoneRegEx = /^\d{10}$/;
    let isValidPhone = phone.match(phoneRegEx);
    if (!isValidPhone) {
      console.log(
        "invalid phone number, kindly enter 10 digits only, no spaces."
      );
      return;
    }
    const payload = {};
    payload[config.enums.appGlobal.payloadEnums.addMember] = 1;
    payload[formEnum.memid] = phone;
    payload[formEnum.name] = formData[formEnum.name];
    payload[formEnum.address] = formData[formEnum.address];
    payload[formEnum.type] = formData[formEnum.memberType];
    payload[formEnum.address_number_sort] = formData[formEnum.addressSort];
    postDataAxios(
      config.endpoints.postEndpointCommon,
      payload,
      ({data, success}) => {
        if (success) {
          resetMemberForm();
        }
      }
    ).then((e) => e);
  };

  useEffect(() => {
    if (!editMode) return
    let editForm = {}
    editForm[formEnum.name] = memberInfo[formEnum.name]
    editForm[formEnum.address] = memberInfo[formEnum.address]
    editForm[formEnum.memberId] = memberInfo[formEnum.memkey]
    editForm[formEnum.addressSort] = memberInfo[formEnum.address_number_sort]
    editForm[formEnum.memberType] = memberInfo[formEnum.type]

    setFormData({...editForm})
  }, [])

  return (
    <React.Fragment>
      <div className="column pad10">
        <div className="size15">
          <span>{editMode ? "Editing Member" : "Add New Member"}</span>
        </div>
        <label>Name</label>
        <input
          name={formEnum.name}
          placeholder="Enter NAME"
          required
          title="NAME"
          type="text"
          onChange={(e) => handleOnChangeInput(e)}
          value={formData[formEnum.name]}
        />
        <label>Mobile Phone Number(without spaces)</label>
        <input
          type="text"
          name={formEnum.memberId}
          placeholder="Enter MOBILE Number 999 999 9999"
          required
          title="enter valid phone number, no spaces, this is unique. Once set, cant be altered"
          value={formData[formEnum.memberId]}
          onChange={(e) => handleOnChangeInput(e)}
          style={{width: "200px"}}
          disabled={editMode}
        />
        <label>Address</label>
        <input
          name={formEnum.address}
          placeholder="Enter ADDRESS"
          title="ADDRESS"
          type="text"
          onChange={(e) => handleOnChangeInput(e)}
          value={formData[formEnum.address]}
        />
        <label>address number (sort)</label>
        <input
          name={formEnum.addressSort}
          placeholder="Number Address"
          title="address number only for sorting"
          type="number"
          onChange={(e) => handleOnChangeInput(e)}
          style={{width: "150px"}}
          value={formData[formEnum.addressSort]}
        />
        <label>Member Type</label>
        <select
          name={formEnum.memberType}
          value={formData[formEnum.memberType]}
          onChange={(e) => handleOnChangeInput(e)}
        ></select>

        <div className="right">
          <button onClick={handleSubmitMember}>Save</button>
          <button onClick={resetMemberForm}>Reset</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddMembers;
