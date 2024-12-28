import React from "react";
import { observer } from "mobx-react-lite";
import styles from "./OverlayContainer.module.scss";
import BackButton from "../../buttons/BackButton";
import X from "../../buttons/XButton";

interface Props {
  children: React.ReactNode;
  onClose?: () => void;
  title?: string;
}

const OverlayContainer = observer(({ children, onClose, title }: Props) => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <BackButton onClick={onClose} />
          <p className={styles.headerName}>{title}</p>
          <X onClick={onClose} />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
});
export default OverlayContainer;
