import React, { ReactElement } from "react";
import CSS from "csstype";
import classNames from "classnames";
import range from "lodash/range";

import styles from "./ProgressBar.module.scss";

interface Props {
  progress: number;
  total: number;
  style?: CSS.Properties;
}

const ProgressBar = ({ progress, total, style = {} }: Props): ReactElement => {
  return (
    <div className={styles.progressBarContainer} style={style}>
      {range(total).map((i) => (
        <div
          key={i}
          className={classNames(
            styles.progressBar,
            i < progress && styles.progressBarFilled
          )}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
