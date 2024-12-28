import React, { useState } from "react";
import { isSupported } from "@twilio/video-processors";
import classNames from "classnames";

import DeviceSelectionDialog from "./DeviceSelectionDialog/DeviceSelectionDialog";
import { useAppState } from "../state";
import useIsRecording from "../hooks/useIsRecording";
import useVideoContext from "../hooks/useVideoContext";
import useFlipCameraToggle from "../hooks/useFlipCameraToggle";
import styles from "./ToggleButton.module.scss";
import moreStyles from "../../components/core/MoreActions.module.scss";
import DropDown from "../../components/core/DropDown";
import DropDownItem from "../../components/core/DropDownItem";
import Background from "../../public/static/icons/Background.svg";
import StartRecording from "../../public/static/icons/StartRecording.svg";
import StopRecording from "../../public/static/icons/StopRecording.svg";
import Settings from "../../public/static/icons/Settings.svg";
import FlipCamera from "../../public/static/icons/FlipCamera.svg";
import Activity from "../../public/static/icons/Activity.svg";
import MoreVertical from "../../public/static/icons/MoreVertical.svg";

const isAdmin = false;

interface Props {
  showLabel?: boolean;
}

const Menu = ({ showLabel = true }: Props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { updateRecordingRules, roomType } = useAppState();
  const isRecording = useIsRecording();
  const { room, setIsBackgroundSelectionOpen } = useVideoContext();

  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } =
    useFlipCameraToggle();

  const toggleRecordingMode = () => {
    if (isRecording) {
      updateRecordingRules(room?.sid, [{ type: "exclude", all: true }]);
    } else {
      updateRecordingRules(room?.sid, [{ type: "include", all: true }]);
    }
  };

  return (
    <>
      <DropDown
        id={"more-settings-menu"}
        trigger={
          <button
            className={classNames(styles.button, styles.inverseButton)}
            type="button"
          >
            <div className={styles.iconContainer}>
              <MoreVertical
                className={classNames(styles.icon, styles.inverseIcon)}
              />
              {showLabel && <span className={styles.buttonText}>More</span>}
            </div>
          </button>
        }
      >
        <DropDownItem
          key={"audio-and-video-settings"}
          onClick={() => setSettingsOpen(true)}
        >
          <div className={moreStyles.itemGroup}>
            <Settings width={18} height={18} />
            <span>Audio and Video Settings</span>
          </div>
        </DropDownItem>
        {isSupported && (
          <DropDownItem
            key={"backgrounds"}
            onClick={() => setIsBackgroundSelectionOpen(true)}
          >
            <div className={moreStyles.itemGroup}>
              <Background width={18} height={18} />
              <span>Backgrounds</span>
            </div>
          </DropDownItem>
        )}
        {flipCameraSupported && !flipCameraDisabled && (
          <DropDownItem key={"flipCamera"} onClick={toggleFacingMode}>
            <div className={moreStyles.itemGroup}>
              <FlipCamera width={18} height={18} />
              <span>Flip Camera</span>
            </div>
          </DropDownItem>
        )}
        {roomType !== "peer-to-peer" && roomType !== "go" && (
          <DropDownItem key={"recording"} onClick={toggleRecordingMode}>
            <div className={moreStyles.itemGroup}>
              {isRecording ? (
                <StopRecording width={18} height={18} />
              ) : (
                <StartRecording width={18} height={18} />
              )}
              <span>{isRecording ? "Stop" : "Start"} Recording</span>
            </div>
          </DropDownItem>
        )}
      </DropDown>
      <DeviceSelectionDialog
        isOpen={settingsOpen}
        onRequestClose={() => {
          setSettingsOpen(false);
        }}
      />
    </>
  );
};

export default Menu;
