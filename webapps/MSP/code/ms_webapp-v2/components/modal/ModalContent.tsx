import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./ModalContent.module.scss";

interface Props {
  children: ReactNode;
}

const ModalContent = observer(({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
});

export default ModalContent;
