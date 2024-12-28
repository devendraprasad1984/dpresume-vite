import React, { ReactElement } from "react";

import styles from "./Toggle.module.scss";

type Props = {
  id: string;
  isToggled: boolean;
  disabled?: boolean;
  onToggle?: (boolean) => void;
};

const Toggle = ({
  id,
  isToggled = false,
  disabled = false,
  onToggle = () => undefined,
}: Props): ReactElement => {
  return (
    <label htmlFor={id} className={styles.toggleLabel}>
      <input
        id={id}
        name={id}
        type="checkbox"
        className={styles.toggle}
        onChange={onToggle}
        checked={isToggled}
        disabled={disabled}
      />
      <span className={styles.pseudoInput} />
    </label>
  );
};

export default Toggle;
