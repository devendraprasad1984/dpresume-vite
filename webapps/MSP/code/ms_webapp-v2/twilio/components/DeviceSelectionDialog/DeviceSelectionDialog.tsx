import React from "react";

import BaseModal from "../../../components/modal/BaseModal";
import ModalContent from "../../../components/modal/ModalContent";
import ModalFooter from "../../../components/modal/ModalFooter";
import AudioInputList from "./AudioInputList";
import AudioOutputList from "./AudioOutputList";
import VideoInputList from "./VideoInputList";
import ContainedButton from "../../../components/buttons/ContainedButton";
import styles from "./DeviceSelectionDialog.module.scss";

const DeviceSelectionDialog = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
}) => {
  return (
    <BaseModal
      title="Audio and Video Settings"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <ModalContent>
        <VideoInputList />
        <hr className="sectionSeparator" />
        <div className={styles.formGroup}>
          <AudioInputList />
          <AudioOutputList />
        </div>
      </ModalContent>
      <ModalFooter>
        <ContainedButton onClick={onRequestClose}>Done</ContainedButton>
      </ModalFooter>
    </BaseModal>
  );
};

export default DeviceSelectionDialog;
