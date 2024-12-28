import React, { ReactElement, ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./MarketingLayout.module.scss";
import Logo from "../../public/static/Logo.svg";
import ActiveLink from "../core/ActiveLink";

interface Props {
  children?: ReactNode;
}

const MarketingLayout = observer(({ children }: Props): ReactElement => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <ActiveLink href="/">
            <Logo className={styles.logo} />
          </ActiveLink>
        </div>
      </div>

      <div className={styles.sideBarAndContent}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
});

export default MarketingLayout;
