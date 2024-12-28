import React, { ReactElement } from "react";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import { IUserSearchForUI } from "../../@types/Admin";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  user: IUserSearchForUI;
  onConfirm: (any) => void;
}

const SuspendUserModal = ({
  isOpen,
  user,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  return (
    <BaseModal
      title="Remove Connection?"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt.
        </p>
        <p className="bodyMedium">{user?.name}</p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Confirm</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default SuspendUserModal;
