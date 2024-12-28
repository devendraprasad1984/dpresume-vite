import React, { ReactElement, useState } from "react";

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
  onConfirm: (IUserSearchForUI) => Promise<any>;
}

const ActivateUserModal = ({
  isOpen,
  user,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [isConfirming, setIsConfirming] = useState(false);

  const confirm = async () => {
    setIsConfirming(true);

    await onConfirm(user).finally(() => setIsConfirming(false));
  };

  return (
    <BaseModal
      title="Activate User"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          You’re about to activate previously deactivated user. Please confirm
          that you want to proceed.
        </p>
        <p className="bodyMedium">{user?.name}</p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose} disabled={isConfirming}>
          Cancel
        </OutlineButton>
        <ContainedButton onClick={confirm} disabled={isConfirming}>
          Confirm
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default ActivateUserModal;
