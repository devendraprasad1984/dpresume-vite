import React, { ReactElement, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  name: string;
  note?: string;
  onConfirm: (note?: string) => void;
}

const AddNoteModal = ({
  isOpen,
  name,
  note,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [noteText, setNoteText] = useState(note);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const confirm = () => {
    setHasSubmitted(true);
    onConfirm(noteText);
  };

  return (
    <BaseModal title="New Note" isOpen={isOpen} onRequestClose={onRequestClose}>
      <ModalContent>
        <p className="smallBody">{name}</p>
        <TextareaAutosize
          placeholder="Write something..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          minRows={10}
          autoFocus={true}
        />
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton disabled={hasSubmitted} onClick={confirm}>
          Submit
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default AddNoteModal;
