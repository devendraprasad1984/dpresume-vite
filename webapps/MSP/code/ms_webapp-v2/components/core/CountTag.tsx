import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./CountTag.module.scss";

interface Props {
  children: ReactNode;
}

const CountTag = observer(({ children }: Props) => {
  return <div className={styles.tag}>{children}</div>;
});

export default CountTag;
