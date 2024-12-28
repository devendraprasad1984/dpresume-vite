import React, { ReactElement } from "react";

import styles from "./GlobalAdd.module.scss";
import Plus from "../../public/static/icons/Plus.svg";

interface Props {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const GlobalAdd = ({
  onClick = () => undefined,
  type = "button",
  disabled,
}: Props): ReactElement => {
  return (
    <button
      className={styles.button}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <Plus className={styles.plusIcon} />
      </div>
    </button>
  );
};

export default GlobalAdd;
