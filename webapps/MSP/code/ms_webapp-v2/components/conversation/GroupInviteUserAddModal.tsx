import React, { ReactElement, useState } from "react";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";
import UserSelector from "../user/UserSelector";
import styles from "./GroupInviteUserAddModal.module.scss";
import useConversationHelper from "../stream/use-conversion-helper";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (members: string[]) => Promise<void>;
}

const GroupInviteUserAddModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const { channelMembers } = useConversationHelper();
  const [newMemberRefs, setNewMemberRefs] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const onMemberSelect = (users: string[]) => {
    setNewMemberRefs(users);
  };

  const confirm = async () => {
    setIsConfirming(true);

    await onConfirm(newMemberRefs).finally(() => setIsConfirming(false));
  };

  const existingUserRefs = channelMembers?.map((item) => item?.user_id);

  return (
    <BaseModal
      title={"Invite Members"}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <div className={styles.container}>
          <UserSelector
            idType="ref"
            onSelect={onMemberSelect}
            existingUserRefs={existingUserRefs}
            filter="peopleSearch"
            showMeOnTop={false}
          />
        </div>
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

export default GroupInviteUserAddModal;
