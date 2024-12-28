import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./BackButton.module.scss";
import Back from "../../public/static/icons/Back.svg";

interface Props {
  onClick?: () => void;
  subtle?: boolean;
}

const BackButton = observer(({ onClick, subtle = true }: Props) => {
  return (
    <button
      type="button"
      className={classNames(styles.button, subtle && styles.subtleButton)}
      onClick={onClick}
    >
      <Back width={24} height={24} />
      <span className="visuallyHidden">Close</span>
    </button>
  );
});

export default BackButton;
