import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./FormSubGroup.module.scss";

interface Props {
  children: ReactNode;
}

const FormSubGroup = observer(({ children }: Props) => {
  return <fieldset className={styles.container}>{children}</fieldset>;
});

export default FormSubGroup;
