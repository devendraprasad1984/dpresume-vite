import React, { ReactElement, useState } from "react";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import { IPersonnelSearchForUI } from "../../@types/Org";
import UserSelector from "../user/UserSelector";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  existingPersonnel: IPersonnelSearchForUI[];
  onConfirm: (userIDs: number[]) => Promise<any>;
}

const AddPersonnelModal = ({
  isOpen,
  existingPersonnel,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedUserIDs, setSelectedUserIDs] = useState<number[]>([]);

  const onAdminSelect = (users: number[]) => {
    setSelectedUserIDs(users);
  };

  const confirm = async () => {
    setIsConfirming(true);

    await onConfirm(selectedUserIDs).finally(() => setIsConfirming(false));
  };

  const existingUserIDs = existingPersonnel?.map((item) => item?.user?.id);

  return (
    <BaseModal
      title="Select Personnel"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <UserSelector
          idType="id"
          label="Select Company Personnel(s)"
          onSelect={onAdminSelect}
          existingUserIDs={existingUserIDs}
          filter="peopleSearch"
          showMeOnTop={true}
        />
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose} disabled={isConfirming}>
          Cancel
        </OutlineButton>
        <ContainedButton onClick={confirm} disabled={isConfirming}>
          Save
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default AddPersonnelModal;
