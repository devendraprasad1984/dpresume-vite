import React, { Ref } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import IconsUtil from "../core/IconsUtil";
import styles from "./Icon.module.scss";
import { IPossibleIconValues } from "../../@types/Icons";

interface Props {
  forwardRef?: Ref<any>;
  size: number;
  iconSize: number;
  icon: IPossibleIconValues;
  label: string;
  disabled?: boolean;
  kind?: "primary" | "secondary" | "filled" | "subtle";
}

const Icon = observer(
  ({
    forwardRef,
    size = 24,
    iconSize = 16,
    icon,
    label,
    kind = "primary",
  }: Props) => {
    return (
      <div
        ref={forwardRef}
        className={classNames(
          styles.button,
          kind === "primary" && styles.primary,
          kind === "secondary" && styles.secondary,
          kind === "filled" && styles.filled,
          kind === "subtle" && styles.subtle
        )}
        style={{ width: size, height: size }}
      >
        <IconsUtil icon={icon} width={iconSize} height={iconSize} />
        {label && <span className="visuallyHidden">{label}</span>}
      </div>
    );
  }
);

export default Icon;
