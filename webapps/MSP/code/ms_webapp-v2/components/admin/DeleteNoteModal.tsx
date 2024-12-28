import React, { ReactElement } from "react";
import { INote } from "ms-npm/admin-models";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  note: INote;
  onConfirm: (note: INote) => void;
}

const DeleteNoteModal = ({
  isOpen,
  note,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const confirm = () => {
    onConfirm(note);
  };

  return (
    <BaseModal
      title="Delete Note"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">Do you want to delete the note?</p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={confirm}>Delete</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default DeleteNoteModal;
