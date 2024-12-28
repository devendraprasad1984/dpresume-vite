import React, { ReactElement, useState } from "react";
import { useChatContext } from "stream-chat-react";

import BaseModal from "../modal/BaseModal";
import ModalContent from "../modal/ModalContent";
import ModalFooter from "../modal/ModalFooter";
import OutlineButton from "../buttons/OutlineButton";
import ContainedButton from "../buttons/ContainedButton";

interface Input {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => Promise<void>;
}

const StartVideoModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: Input): ReactElement => {
  const { channel } = useChatContext();
  const [hasStarted, setHasStarted] = useState(false);

  const confirm = async () => {
    setHasStarted(true);

    try {
      await onConfirm();
    } catch (error) {
      setHasStarted(false);
    }
  };

  return (
    <BaseModal
      title="Start Video Call?"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        {channel.data.member_count === 2 && (
          <p className="smallBody">Do you want to start a video call?</p>
        )}
        {channel.data.member_count > 2 && (
          <p className="smallBody">
            You’ll be start a call that all {channel.data.member_count - 1}{" "}
            members of this group can join.
          </p>
        )}
      </ModalContent>
      <ModalFooter>
        <OutlineButton onClick={onRequestClose} disabled={hasStarted}>
          Cancel
        </OutlineButton>
        <ContainedButton onClick={confirm} disabled={hasStarted}>
          Start Call
        </ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default StartVideoModal;
