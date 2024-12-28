import React from "react";

import styles from "./BackgroundSelectionHeader.module.scss";
import XButton from "../../components/buttons/XButton";

interface BackgroundSelectionHeaderProps {
  onClose: () => void;
}

const BackgroundSelectionHeader = ({
  onClose,
}: BackgroundSelectionHeaderProps) => {
  return (
    <div className={styles.container}>
      <h2 className="buttonText">Backgrounds</h2>
      <XButton onClick={onClose} />
    </div>
  );
};

export default BackgroundSelectionHeader;
