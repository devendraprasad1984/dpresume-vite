import React, { ReactElement, useState } from "react";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (any) => void;
  groupName: string;
}

const EditGroupModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
  groupName,
}: Input): ReactElement => {
  const [groupNameInput, setGroupNameInput] = useState<string>(groupName);
  return (
    <BaseModal
      title="Edit Group Name"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <div>
          <span>Group Name</span>
          <input
            placeholder="Enter new group name"
            value={groupNameInput}
            onChange={(e) => setGroupNameInput(e.target.value)}
          />
        </div>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={() => onConfirm(groupNameInput)}>
          Done
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default EditGroupModal;
