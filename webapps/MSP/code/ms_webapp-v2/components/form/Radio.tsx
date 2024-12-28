import React, { ReactElement } from "react";
import CSS from "csstype";

import styles from "./Radio.module.scss";

interface Props {
  style?: CSS.Properties;
  isChecked: boolean;
  name: string;
  value: string;
  disabled?: boolean;
  label: string | ReactElement;
  secondaryLabel?: string;
  onSelect: (string) => void;
}

const Radio = ({
  isChecked,
  label,
  secondaryLabel,
  name,
  value = "",
  disabled = false,
  onSelect,
  style = {},
}: Props): ReactElement => {
  return (
    <label className={styles.radioLabel} style={style}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.radio}
          type="radio"
          name={name}
          onChange={(e) => onSelect(e.target.value)}
          checked={isChecked}
          value={value}
          disabled={disabled}
        />
        <span className={styles.pseudoInput} />
        <div>
          <div className={styles.labelText}>{label}</div>
          {secondaryLabel && (
            <div className={styles.secondaryLabelText}>{secondaryLabel}</div>
          )}
        </div>
      </div>
    </label>
  );
};

export default Radio;
