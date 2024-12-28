import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";

import styles from "./InputError.module.scss";

export enum InputErrorType {
  Custom = "custom",
  Required = "required",
  Invalid = "invalid",
  URLInvalid = "urlInvalid",
}

interface Props {
  children?: ReactNode;
  messageType: InputErrorType;
  isActive: boolean;
}

const InputError = observer(({ children, messageType, isActive }: Props) => {
  return (
    <div className={styles.container} aria-live="polite">
      {isActive && messageType === "custom" && children}
      {isActive && messageType === "required" && "This field is required"}
      {isActive && messageType === "invalid" && "This field is invalid"}
      {isActive && messageType === "urlInvalid" && "Please enter a valid URL"}
    </div>
  );
});

export default InputError;
