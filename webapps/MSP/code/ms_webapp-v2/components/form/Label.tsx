import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

import styles from "./Label.module.scss";

interface Props {
  children: ReactNode;
  label: string;
  htmlFor: string;
  shiftLabel?: boolean;
}

const Label = observer(
  ({ children, label, htmlFor, shiftLabel = true }: Props) => {
    return (
      <label htmlFor={htmlFor}>
        <span
          className={classNames(
            styles.labelText,
            shiftLabel && styles.shiftLabel
          )}
        >
          {label}
        </span>
        <div>{children}</div>
      </label>
    );
  }
);

export default Label;
