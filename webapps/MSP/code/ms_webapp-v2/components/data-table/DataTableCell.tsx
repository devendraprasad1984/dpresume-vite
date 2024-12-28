import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import UIChip from "../core/UIChip";
import styles from "./DataTableCell.module.scss";

interface Props {
  children: string;
  type?: "uiChip" | "capitalize" | "date" | "dateTime" | "count";
}

const DataTableCell = observer(({ children, type }: Props) => {
  let content: ReactNode = children;

  if (type === "uiChip") {
    content = <UIChip type={children}>{children}</UIChip>;
  }

  if (type === "capitalize") {
    content = <span className={styles.capitalize}>{children}</span>;
  }

  if (type === "date") {
    content = dayjs(children).format("MMM D, YYYY");
  }

  if (type === "dateTime") {
    content = dayjs(children).format("MMM D, YYYY h:mm a");
  }

  if (type === "count" && content === 0) {
    content = <span className={styles.countZero}>{children}</span>;
  }

  return <>{content}</>;
});

export default DataTableCell;
