import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./NoteButton.module.scss";
import Note from "../../public/static/icons/Note.svg";

interface Props {
  onClick?: () => void;
  subtle?: boolean;
  size?: "sm" | "md";
}

const iconSizes = {
  md: 24,
  sm: 14,
};

const NoteButton = observer(
  ({ onClick, subtle = false, size = "md" }: Props) => {
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
        <Note width={iconSize} height={iconSize} />
        <span className="visuallyHidden">New Note</span>
      </button>
    );
  }
);

export default NoteButton;
