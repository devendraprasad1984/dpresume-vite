import React, { ReactElement } from "react";

import { Session } from "../../@types/Session";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  session: Session;
  onConfirm: (any) => void;
}

const ArchiveSessionModal = ({
  isOpen,
  session,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  return (
    <BaseModal
      title="Archive Session"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          Archived sessions are no longer visible to users. Do you want to
          archive:
        </p>
        <p className="bodyMedium">{session?.title}</p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Confirm</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default ArchiveSessionModal;
