import React, { ReactElement, ReactNode } from "react";
import classNames from "classnames";

import styles from "./ContainedLinkButton.module.scss";
import ActiveLink from "../core/ActiveLink";
import IconsUtil from "../core/IconsUtil";
import { IPossibleIconValues } from "../../@types/Icons";

interface Props {
  size?: "S" | "M";
  href: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: IPossibleIconValues;
  iconPosition?: "left" | "right";
  inverse?: boolean;
}

const ContainedLinkButton = ({
  size = "M",
  href,
  children,
  icon,
  disabled,
  iconPosition = "left",
  inverse = false,
}: Props): ReactElement => {
  return (
    <ActiveLink
      className={classNames(
        styles.button,
        size === "M" && styles.sizeM,
        size === "S" && styles.sizeS,
        inverse && styles.inverse
      )}
      href={href}
      disabled={disabled}
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
        <span className={styles.layout}>{children}</span>
        {icon && iconPosition === "right" && (
          <IconsUtil
            className={classNames(inverse ? styles.inverseIcon : styles.icon)}
            icon={icon}
            width={16}
            height={16}
          />
        )}
      </div>
    </ActiveLink>
  );
};

export default ContainedLinkButton;
