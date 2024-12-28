import React from "react";
import classNames from "classnames";

import ScreenShareIcon from "../../public/static/icons/ScreenShare.svg";
import useScreenShareParticipant from "../hooks/useScreenShareParticipant";
import useVideoContext from "../hooks/useVideoContext";
import Tooltip from "../../components/core/Tooltip";
import styles from "./ToggleButton.module.scss";

export const SCREEN_SHARE_TEXT = "Share Screen";
export const STOP_SCREEN_SHARE_TEXT = "Stop Sharing Screen";
export const SHARE_IN_PROGRESS_TEXT =
  "Cannot share screen when another user is sharing";
export const SHARE_NOT_SUPPORTED_TEXT =
  "Screen sharing is not supported with this browser";

interface Props {
  disabled?: boolean;
  inverse?: boolean;
}

const ToggleScreenShareButton = ({ disabled, inverse }: Props) => {
  const screenShareParticipant = useScreenShareParticipant();
  const { toggleScreenShare } = useVideoContext();
  const disableScreenShareButton = Boolean(screenShareParticipant);
  const isScreenShareSupported =
    navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia;
  const isDisabled =
    disabled || disableScreenShareButton || !isScreenShareSupported;

  let tooltipMessage = "";

  if (disableScreenShareButton) {
    tooltipMessage = SHARE_IN_PROGRESS_TEXT;
  }

  if (!isScreenShareSupported) {
    tooltipMessage = SHARE_NOT_SUPPORTED_TEXT;
  }

  return (
    <Tooltip overlay={tooltipMessage} placement="top">
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
          <span className={styles.buttonText}>{SCREEN_SHARE_TEXT}</span>
        </div>
      </button>
    </Tooltip>
  );
};

export default ToggleScreenShareButton;
