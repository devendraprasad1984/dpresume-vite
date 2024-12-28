import React, { ReactElement, useState } from "react";
import { ICompany } from "ms-npm/admin-models";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  org: ICompany;
  onConfirm: (any) => Promise<void>;
}

const DeactivateOrgModal = ({
  isOpen,
  org,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [isConfirming, setIsConfirming] = useState(false);

  const confirm = async () => {
    setIsConfirming(true);

    await onConfirm(org).catch(() => {
      setIsConfirming(false);
    });
  };

  return (
    <BaseModal
      title="Deactivate Company"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">
          Deactivated companies no longer visible to users. Do you want to
          deactivate:
        </p>
        <p className="bodyMedium">{org?.info?.name}</p>
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose} disabled={isConfirming}>
          Cancel
        </OutlineButton>
        <ContainedButton onClick={confirm} disabled={isConfirming}>
          Confirm
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default DeactivateOrgModal;
