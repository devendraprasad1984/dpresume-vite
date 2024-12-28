import React, { ReactElement } from "react";

import { Topic } from "../../@types/Topic";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  topic: Topic;
  onConfirm: (any) => void;
}

const ArchiveTopicModal = ({
  isOpen,
  topic,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  return (
    <BaseModal
      title="Archive Topic"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          Archived topics are no longer visible to users. Do you want to
          archive:
        </p>
        <p className="bodyMedium">{topic?.name}</p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Confirm</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default ArchiveTopicModal;
