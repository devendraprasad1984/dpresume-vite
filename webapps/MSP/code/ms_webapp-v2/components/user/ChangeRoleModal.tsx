import React, { ReactElement, useState } from "react";
import { Role } from "ms-npm/auth-models";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import Select from "../form/Select";
import { IUserSearchForUI } from "../../@types/Admin";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  user: IUserSearchForUI;
  onConfirm: ({ role: string, user: IUserSearchForUI }) => Promise<any>;
}

const ChangeRoleModal = ({
  isOpen,
  user,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const [role, setRole] = useState<Role>(user.role);
  const [isConfirming, setIsConfirming] = useState(false);

  const confirm = async () => {
    setIsConfirming(true);

    await onConfirm({
      role,
      user,
    }).finally(() => setIsConfirming(false));
  };

  return (
    <BaseModal
      title="Change Role"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <p className="smallBody">{user?.name}</p>
        <Select
          id="role"
          inline={true}
          value={role}
          onChange={(role) => setRole(role as Role)}
        >
          {Object.entries(Role).map((item) => (
            <option key={item[0]} value={item[0]}>
              {item[1]}
            </option>
          ))}
        </Select>
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

export default ChangeRoleModal;
