import React, { useCallback, useRef } from "react";
import classNames from "classnames";

import styles from "./ToggleButton.module.scss";
import VideoOffIcon from "../../public/static/icons/VideoOff.svg";
import VideoOnIcon from "../../public/static/icons/VideoOn.svg";
import useDevices from "../hooks/useDevices";
import useLocalVideoToggle from "../hooks/useLocalVideoToggle";

interface Props {
  disabled?: boolean;
  inverse?: boolean;
}

const ToggleVideoButton = ({ disabled, inverse }: Props) => {
  const [isVideoEnabled, toggleVideoEnabled] = useLocalVideoToggle();
  const lastClickTimeRef = useRef(0);
  const { hasVideoInputDevices } = useDevices();

  const toggleVideo = useCallback(() => {
    if (Date.now() - lastClickTimeRef.current > 500) {
      lastClickTimeRef.current = Date.now();
      toggleVideoEnabled();
    }
  }, [toggleVideoEnabled]);

  return (
    <button
      className={classNames(styles.button, inverse && styles.inverseButton)}
      onClick={toggleVideo}
      disabled={!hasVideoInputDevices || disabled}
      type="button"
    >
      <div className={styles.iconContainer}>
        {isVideoEnabled ? (
          <VideoOnIcon
            className={classNames(styles.icon, inverse && styles.inverseIcon)}
          />
        ) : (
          <VideoOffIcon
            className={classNames(styles.icon, inverse && styles.inverseIcon)}
          />
        )}
        <span className={styles.buttonText}>
          {!hasVideoInputDevices
            ? "No Video"
            : isVideoEnabled
            ? "Stop Video"
            : "Start Video"}
        </span>
      </div>
    </button>
  );
};

export default ToggleVideoButton;
