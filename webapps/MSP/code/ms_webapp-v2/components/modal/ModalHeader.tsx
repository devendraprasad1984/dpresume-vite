import React, { ReactElement } from "react";

import styles from "./ModalHeader.module.scss";
import XButton from "../buttons/XButton";

interface Input {
  title?: string;
  onRequestClose: () => void;
}

const ModalHeader = ({ title, onRequestClose }: Input): ReactElement => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.titleSection}>
        <h1 className={styles.modalTitle}>{title}</h1>
      </div>
      <XButton onClick={onRequestClose} />
    </div>
  );
};

export default ModalHeader;
