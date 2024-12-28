import React, { ReactElement } from "react";
import classNames from "classnames";

import Toggle from "./Toggle";
import styles from "./ToggleWithLabel.module.scss";

type Props = {
  id: string;
  isToggled: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label: string;
  textWhenToggled?: string;
  textWhenNotToggled?: string;
};

const ToggleWithLabel = ({
  id,
  isToggled = false,
  disabled = false,
  onToggle,
  label,
  textWhenToggled,
  textWhenNotToggled,
}: Props): ReactElement => {
  const shouldShowSecondaryText = !!(textWhenToggled && textWhenNotToggled);

  return (
    <div
      className={classNames(
        styles.toggleWithLabel,
        shouldShowSecondaryText && styles.hasSecondaryText
      )}
      onClick={onToggle}
    >
      <div className={styles.toggle}>
        <Toggle id={id} isToggled={isToggled} disabled={disabled} />
      </div>
      <div className={styles.labels}>
        <div className={styles.labelsPrimary}>{label}</div>
        {shouldShowSecondaryText && (
          <div className={styles.labelsSecondary}>
            {isToggled
              ? `On - ${textWhenToggled}`
              : `Off - ${textWhenNotToggled}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToggleWithLabel;
