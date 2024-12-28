import React, { ReactElement } from "react";
import DatePicker from "react-datepicker";
import CSS from "csstype";
import "react-datepicker/dist/react-datepicker.css";

import Label from "../form/Label";
import IconUtil from "./IconsUtil";

type Props = {
  id?: string;
  selected: Date;
  onChange: (date: Date) => void;
  label?: string;
  disabled?: boolean;
  style?: CSS.Properties;
  placeholderText?: string;
};

const DatePickerInput = ({
  id,
  selected,
  onChange,
  label = "",
  style = {},
  placeholderText = "",
}: Props): ReactElement => {
  return (
    <div className="datePickerInput" style={style}>
      <Label label={label} htmlFor={id}>
        <IconUtil
          icon="calendar"
          className="calendarIcon"
          width={20}
          height={20}
        />
        <DatePicker
          id={id}
          wrapperClassName="datePickerWrapper"
          selected={selected}
          onChange={onChange}
          showPopperArrow={false}
          placeholderText={placeholderText}
        />
      </Label>
    </div>
  );
};

export default DatePickerInput;
