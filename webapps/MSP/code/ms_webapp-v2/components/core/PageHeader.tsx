import React, { ReactNode } from "react";

import styles from "./PageHeader.module.scss";

interface Props {
  children?: ReactNode;
}

const PageHeader = ({ children }: Props) => {
  return <div className={styles.pageHeader}>{children}</div>;
};

export default PageHeader;
