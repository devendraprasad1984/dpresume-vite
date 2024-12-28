import React, { ReactElement, ReactNode, SyntheticEvent } from "react";
import classNames from "classnames";

import styles from "./OutlineButton.module.scss";
import SignOut from "../../public/static/icons/SignOut.svg";

interface Props {
  size?: "S" | "M";
  onClick?: (e: SyntheticEvent) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: ReactNode;
  icon?: "signOut";
}

const OutlineButton = ({
  size = "M",
  onClick,
  type = "button",
  disabled,
  children,
  icon,
}: Props): ReactElement => {
  return (
    <button
      className={classNames(
        styles.button,
        size === "M" && styles.sizeM,
        size === "S" && styles.sizeS
      )}
      type={type}
      disabled={disabled}
      onClick={onClick && onClick}
    >
      <div className={styles.iconContainer}>
        {icon === "signOut" && (
          <SignOut className={styles.icon} width={16} height={16} />
        )}
        <span className={styles.layout}>{children}</span>
      </div>
    </button>
  );
};

export default OutlineButton;
