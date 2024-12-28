import React, { useState } from "react";
import { LocalVideoTrack } from "twilio-video";

import {
  DEFAULT_VIDEO_CONSTRAINTS,
  SELECTED_VIDEO_INPUT_KEY,
} from "../../constants";
import VideoTrack from "../VideoTrack";
import useDevices from "../../hooks/useDevices";
import useMediaStreamTrack from "../../hooks/useMediaStreamTrack";
import useVideoContext from "../../hooks/useVideoContext";
import styles from "./VideoInputList.module.scss";
import Select from "../../../components/form/Select";
import Label from "../../../components/form/Label";

export default function VideoInputList() {
  const { videoInputDevices } = useDevices();
  const { localTracks } = useVideoContext();

  const localVideoTrack = localTracks.find(
    (track) => track.kind === "video"
  ) as LocalVideoTrack | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  const [storedLocalVideoDeviceId, setStoredLocalVideoDeviceId] = useState(
    window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY)
  );
  const localVideoInputDeviceId =
    mediaStreamTrack?.getSettings().deviceId || storedLocalVideoDeviceId;

  function replaceTrack(newDeviceId: string) {
    // Here we store the device ID in the component state. This is so we can re-render this component display
    // to display the name of the selected device when it is changed while the users camera is off.
    setStoredLocalVideoDeviceId(newDeviceId);
    window.localStorage.setItem(SELECTED_VIDEO_INPUT_KEY, newDeviceId);
    localVideoTrack?.restart({
      ...(DEFAULT_VIDEO_CONSTRAINTS as {}),
      deviceId: { exact: newDeviceId },
    });
  }

  return (
    <div className={styles.formGroup}>
      {localVideoTrack && (
        <div className={styles.preview}>
          <VideoTrack previewStyle={true} isLocal track={localVideoTrack} />
        </div>
      )}
      <Label
        htmlFor="video-input-select"
        label="Video Input"
        shiftLabel={false}
      >
        {videoInputDevices.length > 1 ? (
          <Select
            id="video-input-select"
            onChange={(value) => replaceTrack(value as string)}
            value={localVideoInputDeviceId || ""}
          >
            {videoInputDevices.map((device) => (
              <option value={device.deviceId} key={device.deviceId}>
                {device.label}
              </option>
            ))}
          </Select>
        ) : (
          <p>{localVideoTrack?.mediaStreamTrack.label || "No Local Video"}</p>
        )}
      </Label>
    </div>
  );
}
