import React from "react";
import { LocalAudioTrack } from "twilio-video";

import Select from "../../../components/form/Select";
import AudioLevelIndicator from "../AudioLevelIndicator";
import { SELECTED_AUDIO_INPUT_KEY } from "../../constants";
import useDevices from "../../hooks/useDevices";
import useMediaStreamTrack from "../../hooks/useMediaStreamTrack";
import useVideoContext from "../../hooks/useVideoContext";
import Label from "../../../components/form/Label";
import styles from "./AudioInputList.module.scss";

export default function AudioInputList() {
  const { audioInputDevices } = useDevices();
  const { localTracks } = useVideoContext();

  const localAudioTrack = localTracks.find(
    (track) => track.kind === "audio"
  ) as LocalAudioTrack;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const localAudioInputDeviceId = mediaStreamTrack?.getSettings().deviceId;

  function replaceTrack(newDeviceId: string) {
    window.localStorage.setItem(SELECTED_AUDIO_INPUT_KEY, newDeviceId);
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  return (
    <Label label="Audio Input" htmlFor="audio-input-select" shiftLabel={false}>
      <div className={styles.group}>
        <div>
          {audioInputDevices.length > 1 ? (
            <Select
              id="audio-input-select"
              onChange={(value) => replaceTrack(value as string)}
              value={localAudioInputDeviceId || ""}
            >
              {audioInputDevices.map((device) => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </Select>
          ) : (
            <p>{localAudioTrack?.mediaStreamTrack.label || "No Local Audio"}</p>
          )}
        </div>
        <AudioLevelIndicator audioTrack={localAudioTrack} color="black" />
      </div>
    </Label>
  );
}
