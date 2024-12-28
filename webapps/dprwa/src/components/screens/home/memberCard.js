import React, { useEffect, useRef, useState } from "react";
import { config, getRandomColor } from "../../../configs/config";
import MemberInfo from "./memberInfo";
import AddMembers from "../admin/addMembers";
import BaseModal from "../../common/baseModal";
import WithConfig from "../../../hoc/withConfig";

const getColors = () => {
  let color = { color: getRandomColor("fg") };
  let bgcolor = { backgroundColor: getRandomColor() };
  return { color, bgcolor };
};
const MemberCard = (props) => {
  const { memberDetail, isAdmin } = props;
  const firstTime = useRef(false);
  const [isMemberModal, setIsMemberModal] = useState(false);
  const [isMemberModalEdit, setIsMemberModalEdit] = useState(false);
  const { name, memkey, when, address, type, amount, address_number_sort } =
    memberDetail;
  const [pageAmount, setPageAmount] = useState(parseFloat(amount))
  const [colors, setColors] = useState('white');

  useEffect(() => {
    if (!firstTime.current) return;
    firstTime.current = true;
    // setColors(getColors());
  });

  const handleMemberModalClose = () => {
    setIsMemberModal(false);
  };

  const handleMemberDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert("deleted member");
  };

  const handleMemberEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMemberModalEdit(true);
  };

  const handleCardClick = (row) => {
    setIsMemberModal(true);
  };

  return (
    <React.Fragment>
      <div
        className="cards height200"
        onClick={() => handleCardClick(memberDetail)}
        style={colors.bgcolor}
      >
        <div className="pad10">
          <div className="row wid100">
            <span className="size20 wid100 bl cell" style={colors.color}>
              {name}
            </span>
          </div>
          <div className="row size10">
            <span>ID: {memkey}</span>
            <span className="xblue">{when}</span>
          </div>
        </div>
        <div className="row wid100 pad5">
          <span>
            {address} - {address_number_sort}
          </span>
          <span>{type}</span>
          <span className="size15">
            {config.formatters.formatCurrency(pageAmount)}
          </span>
        </div>

        {isAdmin && <div className="right margin-ud bottomFixedMemberCard wid100">
          <button className="secondary" onClick={(e) => handleMemberEdit(e)}>
            Edit
          </button>
          <button className="danger" onClick={(e) => handleMemberDelete(e)}>
            Delete
          </button>
        </div>}
      </div>

      {isMemberModal && (
        <MemberInfo
          isOpen={isMemberModal}
          onClose={handleMemberModalClose}
          memberInfo={memberDetail}
          setCardAmount={setPageAmount}
        />
      )}
      {isMemberModalEdit && (
        <BaseModal
          {...props}
          title={`Member Edit form - ${memberDetail.name.toUpperCase()}`}
          isOpen={isMemberModalEdit}
          onClose={() => setIsMemberModalEdit(false)}
        >
          <AddMembers editMode={true} memberInfo={memberDetail} />
        </BaseModal>
      )}
    </React.Fragment>
  );
};

export default MemberCard;
