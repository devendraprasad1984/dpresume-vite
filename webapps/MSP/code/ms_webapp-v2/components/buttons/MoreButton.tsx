import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./MoreButton.module.scss";
import MoreVertical from "../../public/static/icons/MoreVertical.svg";

interface Props {
  onClick?: () => void;
  subtle?: boolean;
  size?: "sm" | "md";
}

const iconSizes = {
  md: 24,
  sm: 14,
};

const MoreButton = observer(
  ({ onClick, subtle = true, size = "md" }: Props) => {
    const iconSize = iconSizes[size];

    return (
      <button
        type="button"
        className={classNames(
          styles.button,
          subtle && styles.subtleButton,
          size === "sm" && styles.sm,
          size === "md" && styles.md
        )}
        onClick={onClick}
      >
        <MoreVertical width={iconSize} height={iconSize} />
        <span className="visuallyHidden">More</span>
      </button>
    );
  }
);

export default MoreButton;
