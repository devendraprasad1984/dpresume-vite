import ContainedButton from "../buttons/ContainedButton";
import OutlineButton from "../buttons/OutlineButton";
import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (val?: any) => void;
}

export const DeleteMessageModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
}: Props) => {
  return (
    <BaseModal
      title="Delete Message"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        Are you sure you want to delete this message? This can not be undone.
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose}>Cancel</OutlineButton>
        <ContainedButton onClick={onConfirm}>Delete</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};
