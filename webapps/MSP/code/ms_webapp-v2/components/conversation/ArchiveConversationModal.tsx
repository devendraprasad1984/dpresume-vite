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

const ArchiveConversationModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  return (
    <BaseModal
      title="Archive Conversation"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          By archiving this conversation, you are removing the entire
          conversation and its contents from view, and you will not be notified
          of new messages. Your connection will not be affected.
        </p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Archive</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default ArchiveConversationModal;
