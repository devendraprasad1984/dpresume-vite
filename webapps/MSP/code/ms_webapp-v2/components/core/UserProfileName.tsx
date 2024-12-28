import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./UserProfileName.module.scss";
import fullName from "../../utils/full-name";

interface Props {
  firstName?: string;
  lastName?: string;
  pronouns?: string;
  mode: "listItem" | "header";
}

const UserProfileName = observer(
  ({ firstName, lastName, pronouns, mode }: Props) => {
    const name =
      firstName || lastName ? fullName([firstName, lastName]) : "Unknown";

    return (
      <div>
        <span
          className={classNames(
            mode === "listItem" && styles.listItemName,
            mode === "header" && styles.headerName
          )}
        >
          {name}
        </span>
        {pronouns && <span className={styles.pronouns}>({pronouns})</span>}
      </div>
    );
  }
);

export default UserProfileName;
