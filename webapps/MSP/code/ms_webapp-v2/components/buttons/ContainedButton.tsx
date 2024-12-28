import React, { ReactElement, ReactNode } from "react";
import classNames from "classnames";

import styles from "./ContainedButton.module.scss";
import IconsUtil from "../core/IconsUtil";
import { IPossibleIconValues } from "../../@types/Icons";

interface Props {
  size?: "S" | "M";
  onClick?: (any) => void;
  type?: "button" | "submit";
  disabled?: boolean;
  children: ReactNode;
  icon?: IPossibleIconValues;
  iconPosition?: "left" | "right";
  inverse?: boolean;
}

const ContainedButton = ({
  size = "M",
  onClick,
  type = "button",
  disabled,
  children,
  icon,
  iconPosition = "left",
  inverse = false,
}: Props): ReactElement => {
  return (
    <button
      className={classNames(
        styles.button,
        size === "M" && styles.sizeM,
        size === "S" && styles.sizeS,
        inverse && styles.inverse
      )}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        {icon && iconPosition === "left" && (
          <IconsUtil
            className={classNames(inverse ? styles.inverseIcon : styles.icon)}
            icon={icon}
            width={16}
            height={16}
          />
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <IconsUtil
            className={classNames(inverse ? styles.inverseIcon : styles.icon)}
            icon={icon}
            width={16}
            height={16}
          />
        )}
      </div>
    </button>
  );
};

export default ContainedButton;
