import React, { ChangeEvent, ReactNode } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./Select.module.scss";

interface Props {
  children: ReactNode;
  id: string;
  value: string;
  inline?: boolean;
  disabled?: boolean;
  shorter?: boolean;
  onChange: (data: string) => void;
}

const Select = observer(
  ({
    children,
    id,
    value,
    inline = false,
    disabled = false,
    shorter = false,
    onChange,
  }: Props) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };

    return (
      <div
        className={classNames(
          styles.selectWrapper,
          inline && styles.inlineSelectWrapper,
          shorter ? styles.shorterInput : ""
        )}
      >
        <select
          id={id}
          onChange={handleChange}
          value={value}
          disabled={disabled}
        >
          {children}
        </select>
      </div>
    );
  }
);

export default Select;
