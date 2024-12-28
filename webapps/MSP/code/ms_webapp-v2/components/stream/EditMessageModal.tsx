import React, { useState } from "react";
import ContainedButton from "../buttons/ContainedButton";
import OutlineButton from "../buttons/OutlineButton";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import TextareaAutosize from "react-textarea-autosize";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (val?: any) => void;
  messageText: string;
}

export const EditMessageModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  messageText,
}: Props) => {
  const [newText, setNewText] = useState<string>(messageText);

  const confirm = () => {
    onConfirm(newText);
  };

  return (
    <BaseModal
      title="Edit Message"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <TextareaAutosize
          id={"editMessageBox"}
          minRows={2}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Type your message..."
          value={newText}
        />
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={confirm}>Save</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};
