import React from "react";
import { observer } from "mobx-react-lite";
import TextareaAutosize from "react-textarea-autosize";

import Label from "./Label";
import InputError, { InputErrorType } from "./InputError";

import styles from "./TextInput.module.scss";

interface Props {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  errorType?: InputErrorType;
  validator?: (value: string) => boolean;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  maxLength?: number;
  isTextArea?: boolean;
  showCharLimit?: boolean;
}

const TextInput = observer(
  ({
    id,
    label,
    value,
    placeholder,
    errorType,
    validator,
    onChange,
    onBlur,
    maxLength,
    isTextArea = false,
    showCharLimit = false,
  }: Props) => {
    const handleOnBlur = (e) => {
      const inputValue = e.target.value;
      if ((validator && validator(inputValue)) || !validator) {
        onBlur(inputValue);
      }
    };

    // isValid should be undefined when no validator function is passed
    const isValid = validator && validator(value);

    const optionalProps = {};
    if (isValid === true) {
      optionalProps["aria-invalid"] = false;
    } else if (isValid === false) {
      optionalProps["aria-invalid"] = true;
    }

    return (
      <Label label={label} htmlFor={id}>
        {!isTextArea ? (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur && handleOnBlur}
            placeholder={placeholder}
            autoComplete="off"
            {...optionalProps}
            maxLength={maxLength}
          />
        ) : (
          <TextareaAutosize
            id={id}
            value={value}
            minRows={2}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur && handleOnBlur}
            placeholder={placeholder}
            {...optionalProps}
            maxLength={maxLength}
          />
        )}
        {showCharLimit && (
          <div className={styles.charLimitIndicator}>
            {value.length}/{maxLength}
          </div>
        )}
        {errorType !== undefined && (
          <InputError messageType={errorType} isActive={isValid === false} />
        )}
      </Label>
    );
  }
);

export default TextInput;
