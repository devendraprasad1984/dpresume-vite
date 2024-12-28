import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./MyPageHeader.module.scss";

interface Props {
  title: string;
  children?: ReactNode;
}

const MyPageHeader = observer(({ title, children }: Props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div>{children}</div>
    </div>
  );
});

export default MyPageHeader;
