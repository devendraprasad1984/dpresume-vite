import React, { SyntheticEvent } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./SaveButton.module.scss";
import Bookmark from "../../public/static/icons/Bookmark.svg";

interface Props {
  onClick?: (e: SyntheticEvent) => void;
  subtle?: boolean;
}

const SaveButton = observer(({ onClick, subtle = true }: Props) => {
  return (
    <button
      type="button"
      className={classNames(styles.button, subtle && styles.subtleButton)}
      onClick={onClick}
    >
      <Bookmark width={24} height={24} />
      <span className="visuallyHidden">Save</span>
    </button>
  );
});

export default SaveButton;
