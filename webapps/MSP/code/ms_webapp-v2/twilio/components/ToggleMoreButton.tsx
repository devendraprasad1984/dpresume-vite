import React from "react";
import classNames from "classnames";

import ScreenShareIcon from "../../public/static/icons/ScreenShare.svg";
import useScreenShareParticipant from "../hooks/useScreenShareParticipant";
import useVideoContext from "../hooks/useVideoContext";
import styles from "./ToggleButton.module.scss";

interface Props {
  disabled?: boolean;
  inverse?: boolean;
}

const ToggleMoreButton = ({ disabled, inverse }: Props) => {
  const screenShareParticipant = useScreenShareParticipant();
  const { toggleScreenShare } = useVideoContext();
  const disableScreenShareButton = Boolean(screenShareParticipant);
  const isScreenShareSupported =
    navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled =
    disabled || disableScreenShareButton || !isScreenShareSupported;

  return (
    <button
      className={classNames(styles.button, inverse && styles.inverseButton)}
      type="button"
      onClick={toggleScreenShare}
      disabled={isDisabled}
    >
      <div className={styles.iconContainer}>
        <ScreenShareIcon
          className={classNames(styles.icon, inverse && styles.inverseIcon)}
        />
        <span className={styles.buttonText}>More</span>
      </div>
    </button>
  );
};

export default ToggleMoreButton;
