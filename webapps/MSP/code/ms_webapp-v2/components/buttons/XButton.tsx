import React from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./XButton.module.scss";
import X from "../../public/static/icons/X.svg";

interface Props {
  onClick?: (event: any) => void;
  subtle?: boolean;
  className?: string;
}

const XButton = observer(({ onClick, subtle = true, className }: Props) => {
  return (
    <button
      type="button"
      className={classNames(
        styles.button,
        subtle && styles.subtleButton,
        className
      )}
      onClick={onClick}
    >
      <X width={24} height={24} />
      <span className="visuallyHidden">Close</span>
    </button>
  );
});

export default XButton;
