import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./ProfileChip.module.scss";
import Star from "../../public/static/icons/StarFilled.svg";

interface Props {
  children: ReactNode;
}

const ProfileChip = observer(({ children }: Props) => {
  return (
    <div className={styles.container}>
      <Star width={16} height={16} />
      <span>{children}</span>
    </div>
  );
});

export default ProfileChip;
