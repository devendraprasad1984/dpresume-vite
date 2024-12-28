import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./ModalFooter.module.scss";

interface Props {
  children: ReactNode;
}

const ModalFooter = observer(({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
});

export default ModalFooter;
