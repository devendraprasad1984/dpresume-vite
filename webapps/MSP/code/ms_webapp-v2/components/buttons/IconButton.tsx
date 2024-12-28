import React, { Ref } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import IconsUtil from "../core/IconsUtil";
import styles from "./IconButton.module.scss";
import { IPossibleIconValues } from "../../@types/Icons";

interface Props {
  forwardRef?: Ref<any>;
  type?: "button" | "submit" | "reset";
  size: number;
  iconSize: number;
  icon: IPossibleIconValues;
  label: string;
  onClick?: (any) => void;
  disabled?: boolean;
  kind?: "primary" | "secondary" | "filled";
}

const IconButton = observer(
  ({
    forwardRef,
    type = "button",
    size = 24,
    iconSize = 16,
    icon,
    label,
    onClick,
    disabled,
    kind = "primary",
  }: Props) => {
    return (
      <button
        ref={forwardRef}
        type={type}
        className={classNames(
          styles.button,
          kind === "primary" && styles.primaryButton,
          kind === "secondary" && styles.secondaryButton,
          kind === "filled" && styles.filledButton
        )}
        style={{ width: size, height: size }}
        onClick={onClick}
        disabled={disabled}
      >
        <IconsUtil icon={icon} width={iconSize} height={iconSize} />
        {label && <span className="visuallyHidden">{label}</span>}
      </button>
    );
  }
);

export default IconButton;
