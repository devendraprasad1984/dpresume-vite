import React, { ChangeEvent, ReactElement } from "react";
import classNames from "classnames";

import styles from "./CheckBox.module.scss";

interface Input {
  id: string;
  name?: string;
  children?: ReactElement | string;
  isChecked: boolean;
  disabled?: boolean;
  onChange: (arg0: boolean) => void;
  alignment?: "left" | "right";
  className?: string;
  offset?: boolean;
}

const CheckBox = ({
  id,
  name,
  children,
  isChecked = false,
  disabled,
  onChange,
  alignment = "left",
  className,
  offset = false,
}: Input): ReactElement => {
  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label htmlFor={id} className={classNames(styles.label, className)}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={isChecked}
        onChange={onSelect}
        className={classNames(
          styles.checkbox,
          alignment === "right" && styles.rightAlignment,
          offset && styles.offset
        )}
        disabled={disabled}
      />
      <div>{children}</div>
    </label>
  );
};

export default CheckBox;
