import React, { ReactElement, useState } from "react";
import { IPersonnelSearch } from "ms-npm/company-models";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import fullName from "../../utils/full-name";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  personnel: IPersonnelSearch;
  onConfirm: (personnel: IPersonnelSearch) => Promise<void>;
}

const RemovePersonnelModal = ({
  isOpen,
  personnel,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [isConfirming, setIsConfirming] = useState(false);
  const confirm = async () => {
    setIsConfirming(true);
    await onConfirm(personnel).finally(() => setIsConfirming(false));
  };

  return (
    <BaseModal
      title="Remove Personnel"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          Do you want to remove{" "}
          {fullName([personnel?.user?.firstName, personnel?.user?.lastName])}?
        </p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose} disabled={isConfirming}>
          Cancel
        </OutlineButton>
        <ContainedButton onClick={confirm} disabled={isConfirming}>
          Remove
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default RemovePersonnelModal;
