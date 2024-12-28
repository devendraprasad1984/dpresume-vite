import React, { ReactElement, ReactNode } from "react";
import classNames from "classnames";

import styles from "./TextButton.module.scss";

interface Props {
  size?: "S" | "M";
  onClick: (any) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: ReactNode;
  withPadding?: boolean;
}

const TextButton = ({
  size = "M",
  onClick,
  type = "button",
  disabled,
  children,
  withPadding = false,
}: Props): ReactElement => {
  return (
    <button
      className={classNames(
        styles.button,
        size === "M" && styles.sizeM,
        size === "S" && styles.sizeS,
        size === "M" && withPadding && styles.withPaddingM,
        size === "S" && withPadding && styles.withPaddingS
      )}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <span className={styles.layout}>{children}</span>
      </div>
    </button>
  );
};

export default TextButton;
