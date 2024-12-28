import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./UIChip.module.scss";

interface Props {
  children: ReactNode;
  type:
    | "unread"
    | "sent"
    | "read"
    | "active"
    | "deactivated"
    | "suspended"
    | "unresolved"
    | "resolved"
    | "expired"
    | "published"
    | "unpublished"
    | "upcoming"
    | "ongoing"
    | "past"
    | "pending"
    | string;
}

const UIChip = observer(({ children, type }: Props) => {
  const chipClassNames = [styles.defaultChip];

  if (["unread", "unresolved"].includes(type)) {
    chipClassNames.push(styles.orangeChip);
  }

  if (
    [
      "sent",
      "archived",
      "suspended",
      "resolved",
      "deactivated",
      "past",
    ].includes(type)
  ) {
    chipClassNames.push(styles.lightGrayChip);
  }

  if (
    ["read", "expired", "unpublished", "upcoming", "pending"].includes(type)
  ) {
    chipClassNames.push(styles.grayChip);
  }

  if (["active", "published", "ongoing"].includes(type)) {
    chipClassNames.push(styles.purpleChip);
  }

  return <div className={chipClassNames.join(" ")}>{children}</div>;
});

export default UIChip;
