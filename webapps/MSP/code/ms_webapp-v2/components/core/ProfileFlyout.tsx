import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./ProfileFlyout.module.scss";

interface Props {
  children: ReactNode;
  isOpen: boolean;
}

const ProfileFlyout = observer(({ children, isOpen }: Props) => {
  return (
    <section
      aria-hidden={!isOpen}
      className={classNames(styles.flyout, isOpen && styles.openFlyout)}
    >
      {children}
    </section>
  );
});

export default ProfileFlyout;
