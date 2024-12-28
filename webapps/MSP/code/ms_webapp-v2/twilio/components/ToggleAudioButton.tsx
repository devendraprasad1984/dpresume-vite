import React from "react";
import classNames from "classnames";

import styles from "./ToggleButton.module.scss";
import MicIcon from "../../public/static/icons/Mic.svg";
import MicOffIcon from "../../public/static/icons/MicOff.svg";
import useLocalAudioToggle from "../hooks/useLocalAudioToggle";
import useVideoContext from "../hooks/useVideoContext";

interface Props {
  disabled?: boolean;
  inverse?: boolean;
}

const ToggleAudioButton = ({ disabled, inverse }: Props) => {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some((track) => track.kind === "audio");

  return (
    <button
      className={classNames(styles.button, inverse && styles.inverseButton)}
      onClick={toggleAudioEnabled}
      disabled={!hasAudioTrack || disabled}
      type="button"
    >
      <div className={styles.iconContainer}>
        {isAudioEnabled ? (
          <MicIcon
            className={classNames(styles.icon, inverse && styles.inverseIcon)}
          />
        ) : (
          <MicOffIcon
            className={classNames(styles.icon, inverse && styles.inverseIcon)}
          />
        )}
        <span className={styles.buttonText}>
          {!hasAudioTrack ? "No Audio" : isAudioEnabled ? "Mute" : "Unmute"}
        </span>
      </div>
    </button>
  );
};

export default ToggleAudioButton;
