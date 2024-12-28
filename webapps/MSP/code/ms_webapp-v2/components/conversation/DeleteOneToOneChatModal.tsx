import React, { ReactElement } from "react";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (any) => void;
}

const DeleteOneToOneChatModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  return (
    <BaseModal
      title="Delete This Conversation"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          By Deleting this conversation, You wont be able to recover your chats.
          Please take backup.
        </p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Delete</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default DeleteOneToOneChatModal;
