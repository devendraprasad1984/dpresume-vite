import React, { ReactElement } from "react";

import { Job } from "../../@types/Job";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  job: Job;
  onConfirm: (any) => void;
}

const ArchiveJobModal = ({
  isOpen,
  job,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  return (
    <BaseModal
      title="Archive Job"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          Archived jobs are no longer visible to users. Do you want to archive:
        </p>
        <p className="bodyMedium">{job?.title}</p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Confirm</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default ArchiveJobModal;
