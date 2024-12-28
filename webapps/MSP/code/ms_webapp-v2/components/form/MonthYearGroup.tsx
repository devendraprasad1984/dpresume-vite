import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./MonthYearGroup.module.scss";

interface Props {
  children: ReactNode;
}

const MonthYearGroup = observer(({ children }: Props) => {
  return <fieldset className={styles.container}>{children}</fieldset>;
});

export default MonthYearGroup;
