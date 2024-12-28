import React, { ReactElement } from "react";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  title: string;
  body: string;
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (any) => void;
}

const InviteGroupModal = ({
  title,
  body,
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  return (
    <BaseModal title={title} isOpen={isOpen} onRequestClose={onRequestClose}>
      <ModalContent>
        <div>{body}</div>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Confirm</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default InviteGroupModal;
