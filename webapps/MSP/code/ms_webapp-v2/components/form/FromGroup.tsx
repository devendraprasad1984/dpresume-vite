import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./FormGroup.module.scss";

interface Props {
  children: ReactNode;
}

const FormGroup = observer(({ children }: Props) => {
  return <fieldset className={styles.container}>{children}</fieldset>;
});

export default FormGroup;
