import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./Example.module.scss";

interface Props {
  children: ReactNode;
}

const Example = observer(({ children }: Props) => {
  return <div className={styles.example}>{children}</div>;
});

export default Example;
